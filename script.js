
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: '0 1',
        datasets: [
            {
                label: 'Actual',
                data: [],
                backgroundColor: 'rgb(66, 134, 244, 0.5)'
            },
        ]
    },
    options: {
        maintainAspectRatio: true,    
        plugins: {
            title: {
                display: true,
                text: 'Temperature among 1D bar',
                font: {
                    size:25
                }
            },
            legend:{
                display: false,
                position: 'right'
            }
        },
        elements: {
            point: {
                pointStyle: 'circle',
                borderColor: 'rgb(66, 134, 244, 0.5)'
            },
            line: {
                backgroundColor: 'rgb(66, 134, 244, 0.5)',
                tension: 1,
                borderWidth: 5,
                borderColor:  'rgb(66, 134, 244, 0.5)',
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: (xValue) => {
                        //return Math.floor(yValue); // format to your liking
                        return ((xValue.toFixed(2))/100);
                      },
                },
                title: {
                    display: true,
                    text: 'Length [m]'
                }
            },
            y: {
                title:{
                    display:true,
                    text: 'Temperature [º]'
                }
            }
        }
        
    }
});
const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [0, 1.365],
        datasets: [
            {
                label: 'Actual',
                data: [],
                backgroundColor: 'rgb(66, 134, 244, 0.5)'
            },
        ]
    },
    options: {
        maintainAspectRatio: true,    
        plugins: {
            title: {
                display: true,
                text: 'Temperature among time',
                font: {
                    size:25
                }
            },
            legend:{
                display: false,
                position: 'right'
            }
        },
        elements: {
            point: {
                pointStyle: 'circle',
                borderColor: 'rgb(66, 134, 244, 0.5)'
            },
            line: {
                backgroundColor: 'rgb(66, 134, 244, 0.5)',
                tension: 1,
                borderWidth: 5,
                borderColor:  'rgb(66, 134, 244, 0.5)',
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: (xValue) => {
                        //return Math.floor(yValue); // format to your liking
                        return ((xValue.toFixed(2))/10);
                      },
                },
                title: {
                    display: true,
                    text: 'time [s]'
                }
            },
            y: {
                title:{
                    display:true,
                    text: 'Temperature [º]'
                }
            }
        }
    }
});

function calculatebar()
{
    let N = 101;
    let T = [0];
    let Tant = [0];
    T.length = N;
    Tant.length = N;
    let Tleft = document.getElementById("Tleft").value;
    let Tright = document.getElementById("Tright").value;
    let rho = document.getElementById("Density").value;
    let cp = document.getElementById("Cp").value;
    let lambda = document.getElementById("Conductivity").value;
    let inct = document.getElementById("Timestep").value;
    let L = document.getElementById("L").value;
    let Tini = document.getElementById("Tini").value;
    let alpha = lambda / (rho*cp);
    let incx = L / (N-1);
    T[0] = Tleft*1.0;
    T[N-1] = Tright*1.0; 
    Tant[0] = Tleft*1.0;
    Tant[N-1] = Tright*1.0; 
    let Ttime = [0];
    let cont = 0;
    let contvec = [0];

    //Initialize vectors
    for(let i = 1; i<N-1; i++)
    {
        T[i] = Tini*1.0;
        Tant[i] = Tini*1.0;
    }
    let t = 0;
    let tmax = document.getElementById("Tmax").value;
    tmax = tmax*1.0;
    //Temporal loop
    while(t<tmax)
    {
        for(let i = 1; i<N-1; i++)
        {
            T[i] = Tant[i] + inct*alpha*((Tant[i+1]-2*Tant[i]+Tant[i-1])/(incx*incx));
        }
        for(let i = 1; i<N-1; i++)
        {
            Tant[i] = T[i];
            if(i*incx < (0.5+incx/2) && i*incx > (0.5-incx/2))
            {
                Ttime[cont] = T[i];
            }
        }
        cont++;
        contvec[cont] = t;
        t += inct*1.0;
    }



    //Output error at x=0.75m and 600s
    let Tsolanalitica = 28.0879;
    let Num075 = 3/4*(N);
    let Num075fixed = Num075.toFixed(0)*1.0;
    let x1 = (Num075fixed-1)*incx;
    let error = T[Num075fixed-1] - Tsolanalitica;

    document.getElementById("resultx").value = Math.round(x1*100)/100;
    document.getElementById("resultT").value = Math.round(T[Num075fixed-1]*100)/100;
    document.getElementById("resulterror").value = Math.round(error*1000000)/1000000;

    //Output Plot
    let x = [N];
    for(let i = 0; i<N; i++){
        x[i] = i*incx;
        x[i]
    }

    //Actualize charts
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart.data.datasets[0].data = T;
    myChart.data.labels = x;
    myChart.update();

    const ctx2 = document.getElementById('myChart2').getContext('2d');
    myChart2.data.datasets[0].data = Ttime;
    myChart2.data.labels = contvec;
    myChart2.update();
    
    
}


