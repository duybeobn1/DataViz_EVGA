# 🌍 Water Efficiency of Data Centers in Africa  
### Project Scoping Document  

## 1. Problem Statement  
The exponential growth of artificial intelligence and cloud computing has led to a rapid increase in the number of data centers worldwide. In Africa, where water scarcity is already a major environmental issue, understanding and optimizing **water usage efficiency (WUE)** of data centers is crucial.  
This project aims to visualize how **energy consumption, climate conditions, and cooling systems** interact to influence the **environmental footprint of data centers** in different African regions. The goal is to inform researchers, policymakers, and technology companies about sustainable strategies for AI infrastructure development.

## 2. Target Audience and Key Tasks  
Our visualization targets three main audiences:
- **Researchers and students** studying AI sustainability and resource management.  
- **Policymakers** seeking insights for water-efficient energy policies.  
- **Industry professionals** (data center operators, energy companies) aiming to reduce environmental impact.

The project allows users to:
1. **Compare energy consumption** among African countries, identifying those with the highest total electricity use.  
2. **Explore the energy mix** (fossil fuels vs renewables) per country and its relationship to water efficiency.  
3. **Analyze correlations** between local climate factors (temperature, humidity, precipitation) and WUE (Water Usage Efficiency).  

These tasks highlight how environmental and infrastructural factors shape the sustainability of AI operations in Africa.

## 3. Data Sources  
We use the dataset:  
**[Water Efficiency Dataset for African Data Centers](https://huggingface.co/datasets/masterlion/WaterEfficientDatasetForAfricanCountries)**  
Created by **Noah Shumba, Opelo Tshekiso, Giulia Fanti, Shaolei Ren, and Pengfei Li** (Carnegie Mellon University Africa / UC Riverside, 2024).  

### Key variables:
- **Weather data**: temperature, humidity, precipitation, wet-bulb temperature, wind speed.  
- **Energy data**: energy consumption from renewables, fossil fuels, nuclear, etc.  
- **Water efficiency metrics**: direct and indirect WUE (L/kWh), leakage rates.  

### Strengths
- Combines energy and climate data across multiple African countries.  
- Enables both geographical and temporal analyses of sustainability factors.  

### Limitations
- Some missing or interpolated values for smaller countries.  
- ?

### Backup plan
?

## 4. Related Work  
We identified three related projects:  
1. **“Global Data Center Water Footprint” (OurWorldInData)** — offers general data on water use per energy source but lacks regional climate details.  
2. **“Cooling Efficiency Visualizations” (IEA, 2023)** — explores cooling energy but does not focus on water usage.  
3. **“AI Sustainability Dashboard” (Microsoft, 2022)** — provides corporate metrics without transparency or open data.  

Our project improves on these by **combining open data, local African context, and interactive exploration using D3.js**.

## 5. Organization and Workflow  
- **Communication tools:** GitHub issues & project tracking, discord for coordination.  
- **Planned work sessions:** weekly progress meetings + two dedicated sessions before the January defense.  
- **Roles:**  
  - Data preprocessing: *[Member A]*  
  - Visualization design & D3.js implementation: *[Member B,C]*  
  - Documentation, testing, and deployment: *[Member D]*  

All members contribute to both design and coding.

## 6. Sketch Overview  
**Main visualization ideas:**  
1. **Africa map (choropleth)** – total energy consumption per country, hover tooltip showing energy mix.  
2. **Bar/line chart** – compare WUE values across climate regions.  
3. **Correlation scatterplot** – temperature vs WUE or humidity vs leakage.  
4. **Interactive controls** – sliders or selectors to filter by energy type or region.  

These interactive graphics (built in **D3.js v7**) will be hosted on our **GitHub Pages (.io)** website.
