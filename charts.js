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
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1 - Bar Chart and starting values

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var samplesArray = data.samples;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var subjectId = samplesArray.filter(data => data.id == sample);
   
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = subjectId[0];
    //console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(id => "OTU " + id).reverse();
    //console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      marker: {color: 'rgb(14,131,59)'},
      //orientation:"h",
      text: otu_labels,
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks,
      },
      font: {
        size: 16,
        color: 'rgba(245,245,245,1)'},
      paper_bgcolor: "rgb(43, 43, 43)",
      plot_bgcolor: "rgb(43, 43, 43)"
    };
    
    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot('bar', barData, barLayout);
    


// Deliverable 2 - Bubble Chart

// 1. Create the trace for the bubble chart.
// 2. Create the layout for the bubble chart.
// Create Trace for bubble chart

    var bubbleData = [{
      x: otu_ids,
      y: sampleValues,
      text: otu_labels,
      mode: 'markers',
       marker: {
        size: sampleValues,
        color: otu_ids,
        colorscale: "Greens"
        }
    }];
// Create the layout for the bubble chart. 
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample<b>",
      showlegend: false,
      xaxis: {title: "<b>OTU ID<b>", automargin: true},
      yaxis: {automargin: true},
      hovermode: "closest",
      paper_bgcolor: "rgb(106, 245, 168)",
      plot_bgcolor: "rgb(43, 43, 43)"

    };
    //console.log(bubbleLayout);    

    Plotly.newPlot("bubble",bubbleData, bubbleLayout);

// Deliverable 3 Guage Chart

      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_subjectId = data.metadata.filter(data => data.id == sample);
    //console.log(metadata_subjectId);

    // 3. Create a variable that holds the washing frequency.
    var washFreq = +metadata_subjectId[0].wfreq;
   
     // 4. Create the trace for the gauge chart.
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
       domain:{x:[0,1], y:[0,1]},
       value: washFreq,
       type: 'indicator',
       title:{ 
         text: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',  
       },
         mode:"gauge+number",
         gauge:{
           axis: { range:[null,10]},
           bar:{color:'black'},
           steps: [
             {range:[0,2], color:"red"},
             {range:[2,4], color:"orange"},
             {range:[4,6], color: "yellow"},
             {range:[6,8], color:'lightgreen'},
             {range:[8,10], color:'green'}
           ],

          }
       }
      ];
      
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: 'white',
      paper_bgcolor: "rgb(43, 43, 43)",
      autosize: true,
      automargin: true,
      font: {
        color: 'rgba(245,245,245,1)'},
      
      
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: 'The guage indicates how often the belly button is washed per week',
        color: 'rgba(43, 43, 43)',
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)

  });
}