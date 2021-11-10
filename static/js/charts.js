function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    //console.log(samples);

    //console.log(sample);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log('filteredSample is ' +filteredSample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata.filter(md => md.id ==sample); //samples.filter(sampleObj => sampleObj.id == sample);
    console.log('metadata is ' +metadata);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = filteredSample[0];
    console.log('sampleResult is '+sampleResult);

    // 2. Create a variable that holds the first sample in the metadata array.
    var sampleMetadata = metadata[0];
    console.log('sampleMetadata is '+sampleMetadata);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds  = sampleResult.otu_ids;
    var otuLabels  = sampleResult.otu_labels;
    var sampleValues  = sampleResult.sample_values;

    //console.log('otu_ids are '+  otuIds);  
    //console.log('otu_labels are ' +otuLabels);
    //console.log('sample_values are ' +sampleValues);

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(sampleMetadata.wfreq);
    console.log('washFreq are '+  washFreq);  

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks =[];
    for (let i = 0; i < 10; i++) {
      if(otuIds[i] != '')
       yticks.push(`OTU ${otuIds[i]}`);
      ;
    }
    
    console.log('yticks are '+yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
        
        x: sampleValues.slice(0,10).reverse(),
        y: yticks.reverse(),
        text: otuLabels.slice(0,10).reverse(), 
        type: 'bar',
        orientation: 'h'
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>'
    }; 

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', [barData], barLayout);
    //Deliverable 1 Ended
    
    //Deliverable 2 Begin: Bubble charts
     // 1. Create the trace for the bubble chart.
     var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        hovertemplate: '(%{x}, %{y}) <br> %{text}',
        text:  otuLabels,
        mode: 'markers',
        marker: {
          size:sampleValues, 
          color: otuIds,
          colorscale: 'Earth'
        }
      }];

   
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      hovermode: 'closest',
      xaxis: {
        title: {
          text: 'OTU ID'   
          }       
        },
      margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData, bubbleLayout); 
  
    //Deliverable 3 Begin: Gauge charts
    // 4. Create the trace for the gauge chart.

    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq ,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      //title: 
      width: 500, height: 450, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);

  });
}
