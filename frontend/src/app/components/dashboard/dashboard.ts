import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as d3 from 'd3';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [FontAwesomeModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  userEmail: string = '';
  activeSensors = 43;
  regionCount = 12;
  alertCount = 5;
  totalPowerToday = 4520; // kWh
  uptimePercent = 98.4;
  liveDataRate = 62; // kHz

  // Region Grid
  regionConsumption = [
    { region: 'North Zone', value: 320, loadPercent: 72 },
    { region: 'South Zone', value: 90, loadPercent: 45 },
    { region: 'East Zone', value: 440, loadPercent: 86 },
    { region: 'West Zone', value: 150, loadPercent: 33 },
    { region: 'HQ Building', value: 620, loadPercent: 79 },
    { region: 'Plant 1', value: 210, loadPercent: 72 },
    { region: 'Plant 2', value: 130, loadPercent: 45 },
  ];

  REGION_INFO: Record<string, { code: string; name: string; states: string[] }> = {
      NR: {
        code: 'NR',
        name: 'Northern Region (NR)',
        states: [
          'Haryana',
          'Himachal Pradesh',
          'Jammu and Kashmir',
          'Ladakh',
          'Punjab',
          'Rajasthan',
          'Uttar Pradesh',
          'Uttarakhand',
          'Delhi',
        ],
      },
      ER: {
        code: 'ER',
        name: 'Eastern Region (ER)',
        states: ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal', 'Sikkim'],
      },
      WR: {
        code: 'WR',
        name: 'Western Region (WR)',
        states: [
          'Chhattisgarh',
          'Goa',
          'Gujarat',
          'Madhya Pradesh',
          'Maharashtra',
          'Dadra and Nagar Haveli',
        ],
      },
      NER: {
        code: 'NER',
        name: 'Northeastern Region (NER)',
        states: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Tripura',
        ],
      },
      SR: {
        code: 'SR',
        name: 'Southern Region (SR)',
        states: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Puducherry'],
      },
  };

    // Colors for the 5 regions
    regionColor: Record<string, string> = {
      NR: '#2563eb', // blue
      ER: '#ef4444', // red
      WR: '#10b981', // green
      NER: '#f59e0b', // amber
      SR: '#8b5cf6', // purple
    };

    // If you already have values, set regionMetrics[code] = number
    regionMetrics: Record<string, { loadPercent: number, kwh: number }> = {
      NR: { loadPercent: 72, kwh: 1200 },
      ER: { loadPercent: 45, kwh: 900 },
      WR: { loadPercent: 86, kwh: 1500 },
      NER: { loadPercent: 33, kwh: 300 },
      SR: { loadPercent: 79, kwh: 1800 }
    };

  // Alerts List
  recentAlerts = [
    { message: 'Overload detected in Plant 2', type: 'critical', time: '2m ago' },
    { message: 'Sensor #23 battery low', type: 'warning', time: '10m ago' },
    { message: 'Data restored for North Zone', type: 'info', time: '30m ago' },
  ];

  regionStability: Array<{ code: string; name: string; score: number; note?: string }> = [];
  criticalRegions: Array<{ code: string; name: string; loadPercent: number }> = [];

  // Offline Sensors
  offlineSensors = ['Sensor #14', 'Sensor #29', 'Sensor #07'];

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown'; //TODO: Replace later with decoded JWT
  }

  ngOnInit(): void {
    this.computeRegionStability();
    this.computeCriticalRegions(80); // threshold: load% >= 80 considered critical
  }

  ngAfterViewInit(): void {
    this.drawPowerConsumptionChart();
    this.drawSensorHealthChart();
    this.drawIndiaRegionMap().catch((err) => console.error(err));
  }

  private computeRegionStability() {
    const result: Array<{ code: string; name: string; score: number; note?: string }> = [];

    for (const [code, meta] of Object.entries(this.REGION_INFO)) {
      const metrics = this.regionMetrics[code];
      // if missing, assume medium load
      const load = metrics ? metrics.loadPercent : 60;

      // mock health factor: assume uptime and alerts reduce stability
      const uptimeFactor = this.uptimePercent / 100; // e.g., 0.984
      const alertPenalty = this.recentAlerts.some(a => a.type === 'critical') ? 6 : 0;

      // stability formula (example): higher load reduces stability
      let score = Math.round((100 - load) * 0.6 + uptimeFactor * 40 - alertPenalty);
      score = Math.max(0, Math.min(100, score)); // clamp 0-100

      let note = 'Stable';
      if (score < 50) note = 'Unstable — Attention';
      else if (score < 75) note = 'Moderate';

      result.push({ code, name: meta.name, score, note });
    }

    // sort by score descending (optional)
    result.sort((a, b) => b.score - a.score);
    this.regionStability = result;
  }

  // Regions with loadPercent >= threshold are considered critical
  private computeCriticalRegions(threshold = 80) {
    const critical: Array<{ code: string; name: string; loadPercent: number }> = [];

    for (const [code, meta] of Object.entries(this.REGION_INFO)) {
      const metrics = this.regionMetrics[code];
      const load = metrics ? metrics.loadPercent : 0;
      if (load >= threshold) critical.push({ code, name: meta.name, loadPercent: load });
    }

    // sort by load desc
    critical.sort((a, b) => b.loadPercent - a.loadPercent);
    this.criticalRegions = critical;
  }

  // --------------------------
  // POWER CONSUMPTION (Line)
  // --------------------------
  private drawPowerConsumptionChart() {
    const data = [
      { time: '00:00', value: 30 },
      { time: '02:00', value: 45 },
      { time: '04:00', value: 50 },
      { time: '06:00', value: 80 },
      { time: '08:00', value: 120 },
      { time: '10:00', value: 140 },
      { time: '12:00', value: 160 },
      { time: '14:00', value: 180 },
      { time: '16:00', value: 150 },
      { time: '18:00', value: 110 },
      { time: '20:00', value: 70 },
      { time: '22:00', value: 40 },
    ];

    const element = d3.select('#powerChart');
    const width = 500;
    const height = 280;
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };

    element.selectAll('*').remove();

    const svg = element
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.time))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<any>()
      .x((d) => x(d.time)!)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Line Path Animation
    const path = svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 3)
      .attr('d', line as any);

    const totalLength = (path.node() as SVGPathElement).getTotalLength();

    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubic)
      .attr('stroke-dashoffset', 0);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('fill', '#cbd5e1');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', '#cbd5e1');

    // Axis Labels
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .style('text-anchor', 'middle')
      .style('fill', '#cbd5e1')
      .text('Time (Hours)');

    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .style('fill', '#cbd5e1')
      .text('Power Usage (W)');

    // -----------------------------
    // HOVER INTERACTION ELEMENTS
    // -----------------------------

    // Tooltip box
    const tooltip = element
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 12px')
      .style('background', '#1e293b')
      .style('border-radius', '6px')
      .style('color', 'white')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', '0');

    // Hover circle
    const hoverCircle = svg
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#fff')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 3)
      .style('opacity', 0);

    // Vertical line
    const hoverLine = svg
      .append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .style('opacity', 0);

    // Transparent overlay for capturing mouse
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'transparent')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);

        // Find nearest data point
        const distances = data.map((d) => Math.abs(mouseX - x(d.time)!));
        const index = distances.indexOf(Math.min(...distances));
        const d = data[index];

        const cx = x(d.time)!;
        const cy = y(d.value);

        hoverCircle.attr('cx', cx).attr('cy', cy).style('opacity', 1);

        hoverLine
          .attr('x1', cx)
          .attr('x2', cx)
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .style('opacity', 1);

        tooltip
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .style('opacity', 1)
          .html(`<strong>${d.time}</strong><br>Power: ${d.value} W`);
      })
      .on('mouseleave', () => {
        hoverCircle.style('opacity', 0);
        hoverLine.style('opacity', 0);
        tooltip.style('opacity', 0);
      });
  }

  // --------------------------
  // SENSOR HEALTH (Pie Chart)
  // --------------------------
  private drawSensorHealthChart() {
    const data = [
      { status: 'Healthy', value: 70 },
      { status: 'Warning', value: 20 },
      { status: 'Critical', value: 10 },
    ];

    const colors = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => d.status))
      .range(['#10b981', '#f59e0b', '#ef4444']);

    const element = d3.select('#sensorHealthChart');
    const width = 350;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    element.selectAll('*').remove();

    const svg = element
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    const outerArc = d3
      .arc<any>()
      .innerRadius(radius * 1.15)
      .outerRadius(radius * 1.15);

    // -------------------
    // DRAW PIE SLICES
    // -------------------
    const slices = svg
      .selectAll('path.slice')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('fill', (d) => colors(d.data.status)!)
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)
      .each(function (d) {
        (this as any)._current = d;
      })
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t))!;
      });

    // ⭐ HOVER EXPANSION EFFECT ⭐
    svg
      .selectAll('path.slice')
      .on('mouseenter', function (event: any, d: any) {
        const dist = 12; // how much expansion
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.sin(angle) * dist;
        const y = -Math.cos(angle) * dist;

        d3.select(this)
          .transition()
          .duration(250)
          .attr('transform', `translate(${x}, ${y})`)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(250)
          .attr('transform', 'translate(0,0)')
          .attr('stroke-width', 2);
      });

    // -------------------
    // OUTSIDE LABEL LINES
    // -------------------
    svg
      .selectAll('polyline')
      .data(pie(data))
      .enter()
      .append('polyline')
      .style('fill', 'none')
      .style('stroke', (d) => colors(d.data.status)!)
      .style('stroke-width', 2)
      .style('opacity', 0)
      .attr('points', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.4 : -1.4);
        const points = [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
        return points.map((p) => p.join(',')).join(' ');
      })
      .transition()
      .delay(800)
      .duration(600)
      .style('opacity', 1)
      .attr('points', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.4 : -1.4);
        const points = [arc.centroid(d), outerArc.centroid(d), pos];
        return points.map((p) => p.join(',')).join(' ');
      });

    // -------------------
    // OUTSIDE LABEL TEXT
    // -------------------
    svg
      .selectAll('text.label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('opacity', 0)
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.55 : -1.55);
        pos[1] += 5;
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => (midAngle(d) < Math.PI ? 'start' : 'end'))
      .text((d) => `${d.data.status} (${d.data.value}%)`)
      .transition()
      .delay(1200)
      .duration(600)
      .style('opacity', 1);

    // Helper to check slice side
    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
  }

  // --------------------------
  // INDIA REGION MAP
  // --------------------------
  private async drawIndiaRegionMap() {
    const STATE_POWER_INFO: Record<string, string> = {
      Haryana: 'Peak demand 13 GW, strong industrial load, HV transmission 400kV backbone.',
      Punjab: 'Peak demand 9 GW, major agricultural consumption, robust 220kV grid.',
      Rajasthan: 'India’s largest solar generation hub, >10 GW RE capacity.',
      'Uttar Pradesh': 'India’s highest power demand state (>25 GW), dense distribution network.',
      Delhi: 'High urban load, peak demand 8 GW, fully underground distribution zones.',
      Jharkhand: 'Coal-rich region, strong 132/220kV inter-state transfer.',
      Odisha: 'Heavy industrial demand due to steel & mining sectors.',
      Gujarat: 'India’s most reliable grid, >30 GW capacity, strong industrial corridor.',
      Maharashtra: 'Highest industrial consumption (>22 GW), dense transmission grid.',
      Karnataka: 'High renewable penetration (>15 GW wind/solar).',
      'Tamil Nadu': 'Largest wind power state, strong 230/400kV network.',
      Telangana: 'Stable 400kV backbone, high agricultural consumption.',
      Assam: 'NER transmission hub, heavy dependence on 132 kV ring.',
      Ladakh: 'Remote grid, solar-diesel hybrid systems for off-grid areas.',
      'Dadra and Nagar Haveli': 'Union Territory with mixed generation sources, including solar.',
      Chandigarh: 'Union Territory with a focus on solar energy and energy efficiency.',
      'Jammu and Kashmir': 'Union Territory with significant hydroelectric potential.',
      Uttarakhand: 'Hydro-rich state with growing industrial demand.',
      'Andaman and Nicobar': 'Island territory relying on diesel and solar hybrid systems.',
      Puducherry: 'Union Territory with a focus on solar energy and energy efficiency.',
      Sikkim: 'Hydro-rich state with a focus on renewable energy integration.',
      Meghalaya: 'Northeastern state with hydroelectric potential and rural electrification focus.',
      Mizoram: 'Northeastern state focusing on rural electrification and renewable energy.',
      'Arunachal Pradesh': 'Northeastern state with significant hydroelectric potential.',
      Manipur: 'Northeastern state focusing on rural electrification and grid stability.',
      Nagaland: 'Northeastern state focusing on rural electrification and renewable energy.',
      Tripura: 'Northeastern state with a focus on rural electrification and energy access.',
      'Andhra Pradesh': 'High renewable penetration (>15 GW wind/solar).',
      Kerala: 'High urban load, peak demand 7 GW, focus on energy efficiency.',
      'Madhya Pradesh': 'Central India’s power hub, strong 400kV transmission network.',
      Chhattisgarh: 'Coal-rich state with significant thermal generation capacity.',
      Goa: 'Tourism-driven demand, focus on solar and energy efficiency.',
      'West Bengal': 'High industrial demand, strong 220/400kV grid connectivity.',
      Bihar: 'Rapidly growing demand, focus on rural electrification and grid expansion.',
      'Himachal Pradesh': 'Hydro-rich state with a focus on renewable energy integration.',
      // Add more as needed...
    };

    // Prepare DOM containers
    const container = d3.select('#regionMap');
    container.selectAll('*').remove();

    const containerNode = container.node() as HTMLElement | null;
    const width = Math.max(700, containerNode?.clientWidth || 800);
    const height = 600;

    const svg = container
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent');

    const mapRoot = svg.append('g').attr('id', 'map-root');

    const statesLayer = mapRoot.append('g').attr('id', 'states-layer');
    const labelsLayer = mapRoot.append('g').attr('id', 'labels-layer');

    // Tooltip (HTML overlay)
    const tooltip = container
      .append('div')
      .attr('class', 'india-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(17,24,39,0.95)')
      .style('color', '#fff')
      .style('padding', '10px 12px')
      .style('border-radius', '6px')
      .style('font-size', '13px')
      .style('box-shadow', '0 4px 14px rgba(0,0,0,0.4)')
      .style('opacity', '0');

    // Legend container
    const legendG = statesLayer
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(500,16)`);

    // Load GeoJSON (states)
    const geoData: any = await d3.json('assets/india_states.geojson');

    if (!geoData || !geoData.features || geoData.features.length === 0) {
      console.error('GeoJSON failed to load or contains no features');
      return;
    }

    // Detect the property name that holds the state name
    const sampleFeature =
      geoData && geoData.features && geoData.features[0] ? geoData.features[0] : null;
    if (!sampleFeature) {
      console.error('GeoJSON appears empty or invalid');
      return;
    }

    // Try common property keys
    const candidateKeys = ['st_nm', 'STATE', 'NAME_1', 'name', 'NAME'];
    let statePropKey: string | null = null;
    for (const k of candidateKeys) {
      if (sampleFeature.properties && sampleFeature.properties[k]) {
        statePropKey = k;
        break;
      }
    }
    if (!statePropKey) {
      // fallback: use first property (risky)
      statePropKey = Object.keys(sampleFeature.properties)[0];
      console.warn('Using fallback state property:', statePropKey);
    }

    // Build a lookup of state name (normalized) -> regionCode
    const stateToRegion = new Map<string, string>();
    for (const [code, info] of Object.entries(this.REGION_INFO)) {
      info.states.forEach((s) => stateToRegion.set(s.toLowerCase(), code));
    }

    // Some geojson names deviate (e.g., 'Andaman & Nicobar Islands' etc.).
    // Add manual maps here if your geojson uses different names:
    const manualNameMap: Record<string, string> = {
      // common discrepancies (add as needed)
      'andhra pradesh': 'Andhra Pradesh',
      'uttar pradesh': 'Uttar Pradesh',
      'Andaman and Nicobar': 'Andaman and Nicobar',
      'Dādra and Nagar Haveli and Damān and Diu': 'Dadra and Nagar Haveli and Daman and Diu',
      'jammu & kashmir': 'Jammu and Kashmir',
      odisha: 'Odisha',
      Puducherry: 'Puducherry',
    };

    // Create Geo projection and path that fits the geo data
    const projection = d3.geoMercator().fitSize([width, height], geoData as any);

    const pathGen = d3.geoPath().projection(projection);

    // Build a map of geo feature name (normalized) => feature, for convenience
    const features = (geoData as any).features as any[];
    features.forEach((f) => {
      const rawName = String(f.properties[statePropKey]).trim();
      const norm = rawName.toLowerCase();
      // if manual map exists, use that normalized name to match stateToRegion keys
      if (manualNameMap[norm]) {
        f._stateName = manualNameMap[norm];
        f._stateKey = manualNameMap[norm].toLowerCase();
      } else {
        f._stateName = rawName;
        f._stateKey = norm;
      }
    });

    // For tooltip text: precompute region → states string
    const regionStatesText: Record<string, string> = {};
    for (const [code, info] of Object.entries(this.REGION_INFO)) {
      regionStatesText[code] = info.states.join(', ');
    }

    // Draw features
    statesLayer
      .selectAll('path.state')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', (d) => pathGen(d as any)!)
      .attr('fill', (d: any) => {
        const key = d._stateKey as string;
        let regionCode = stateToRegion.get(key);
        if (!regionCode) {
          // try matching by capitalized manualNameMap keys if any
          const manualNormalized = (manualNameMap[key] || '').toLowerCase();
          regionCode = manualNormalized ? stateToRegion.get(manualNormalized) : undefined;
        }
        return regionCode ? this.regionColor[regionCode] : '#1f2937'; // dark fallback
      })
      .attr('stroke', '#374151')
      .attr('stroke-width', 0.6)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event: any, d: any) {
        // highlight
        d3.select(this).raise().transition().duration(120).attr('stroke-width', 1.6);
        labelsLayer.raise();

        const key = d._stateKey as string;
        // find region code
        let regionCode = stateToRegion.get(key);
        if (!regionCode) {
          const manualNormalized = (manualNameMap[key] || '').toLowerCase();
          regionCode = manualNormalized ? stateToRegion.get(manualNormalized) : undefined;
        }

        const powerInfo = STATE_POWER_INFO[d._stateName] || 'Power grid data unavailable.';

        const html = `
    <div style="font-weight:700;margin-bottom:6px;">${d._stateName}</div>
    <div style="font-size:13px;color:#9ca3af;margin-top:6px;">
        <strong style="color:#fff">Grid Info:</strong>
        <span style="color:#d1d5db">${powerInfo}</span>
    </div>
`;
        tooltip.html(html).style('opacity', '1');
      })
      .on('mousemove', function (event) {
        // move tooltip — use page coords so tooltip follows pointer
        tooltip.style('left', event.pageX + 12 + 'px').style('top', event.pageY + 8 + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(120).attr('stroke-width', 0.6);
        tooltip.style('opacity', '0');
      })
      .on('click', function (event: any, d: any) {
        // optional: navigate to region details if you want
        // const key = d._stateKey;
        // yourRouter.navigate(['/region', key]);
      });

    // Legend (region color boxes + metric)
    const legendItems = Object.entries(this.REGION_INFO);
    const legendX = 10;
    let legendY = 0;
    const legendRectSize = 12;
    const legendGap = 6;
    legendItems.forEach(([code, info], idx) => {
      const g = legendG.append('g').attr('transform', `translate(0, ${legendY})`);
      g.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('fill', this.regionColor[code])
        .attr('rx', 2)
        .attr('ry', 2);

      g.append('text')
        .attr('x', legendRectSize + legendGap)
        .attr('y', legendRectSize - 1)
        .text(`${info.name} ${this.regionMetrics[code] ? `— ${this.regionMetrics[code].kwh} kWh` : ''}`)
        .style('fill', '#d1d5db')
        .style('font-size', '12px');

      legendY += legendRectSize + 8;
    });

    // Zoom & Pan
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        mapRoot.attr('transform', event.transform.toString());
        legendG.attr(
          'transform',
          `translate(${500 * event.transform.k}, ${16 * event.transform.k})`
        );
      });

    svg.call(zoom as any);

    //Add Region names on the map
    // Compute region label positions
    const regionCenters: Record<string, any[]> = {
      NR: [],
      ER: [],
      WR: [],
      NER: [],
      SR: [],
    };

    // Collect all state centroids per region
    features.forEach((f) => {
      const key = f._stateKey;
      const regionCode = stateToRegion.get(key);
      if (regionCode) {
        const centroid = pathGen.centroid(f);
        if (centroid && centroid[0] && centroid[1]) {
          regionCenters[regionCode].push(centroid);
        }
      }
    });

    // Add region labels
    Object.entries(regionCenters).forEach(([code, centers]) => {
      if (centers.length === 0) return;

      // Average centroid for the whole region
      const x = d3.mean(centers.map((c) => c[0]))!;
      const y = d3.mean(centers.map((c) => c[1]))!;

      labelsLayer
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .text(code) // NR / ER / WR / NER / SR
        .style('fill', '#ffffff')
        .style('font-size', '26px')
        .style('font-weight', '700')
        .style('opacity', 0.5)
        .style('pointer-events', 'none')
        .style('position', 'absolute');
    });
  }
}
