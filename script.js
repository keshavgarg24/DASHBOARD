let ctx = document.getElementById('myChart').getContext('2d');
let myChart;
let Jsondata;

// Fetch JSON data from eve.json file
fetch("eve.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log("Data fetched:", data); 
        Jsondata = data;
        createChart(Jsondata, 'bar');
    })
    .catch(error => console.error("Error fetching JSON data:", error));

function createChart(data, type) {
    console.log("Creating chart with data:", data); 

    if (!data || !Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return;
    }

    const timestamps = data.map(item => {
        return item.timestamp ? new Date(item.timestamp).toLocaleString() : "Unknown";
    });
    const severities = data.map(item => {
        return item.alert && item.alert.severity ? item.alert.severity : 0;
    });
    const actions = data.map(item => {
        return item.alert && item.alert.action ? item.alert.action : "Unknown";
    });
    const signatures = data.map(item => {
        return item.alert && item.alert.signature ? item.alert.signature : "Unknown";
    });

    if (myChart) {
        myChart.destroy(); 
    }

    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Severity',
                data: severities,
                borderWidth: 1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            return `Severity: ${severities[index]}, Action: ${actions[index]}, Signature: ${signatures[index]}`;
                        }
                    }
                }
            }
        }
    });
}

function setChartType(chartType) {
    console.log("Changing chart type to:", chartType); 
    createChart(Jsondata, chartType);
}
