
import React, {Component} from "react";
import { Line, Bar } from "react-chartjs-2";
import classNames from "classnames";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.css';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,

} from "reactstrap";



class App extends Component {
  

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isPlotLoading:false,
      formData: {
        article: 'Elon_Musk',
        startDate: '2018-1-1',
        endDate: '2018-6-29',
        singleDate: '2018-3-15'
      },
      views: "00",
      minviews: "00",
      maxviews: "00",
      trend: "00",
      yPlot1: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
      xPlot:["January", "February", "March", "April", "May", "June", "July"], 
      yPlot2x:['2018-3-12',  '2018-3-13', '2018-3-14',   '2018-3-15',  '2018-3-16',
      '2018-3-17',
      '2018-3-18'] ,
      yPlot2y: [100, 130, 110, 95, 120, 85, 100, 83, 96, 80, 125]


    };
  }
  
 
  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }
  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch('https://web-traffic-forecast-wiki.herokuapp.com/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          views: response.result.views,
          minviews: response.result.minviews,
          maxviews:response.result.maxviews,
          trend:response.result.trend,
          yPlot2x:response.result.plotData.yPlot2x,
          yPlot2y:response.result.plotData.yPlot2y,
          isLoading: false
        });
      });    
      
  }

  handlePlotClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isPlotLoading: true });
    fetch('https://web-traffic-forecast-wiki.herokuapp.com/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          yPlot1:response.result.plotData.yPlot1,
          xPlot:response.result.plotData.xPlot,
          isPlotLoading: false
      });
      });
    }

  handleCancelClick = (event) => {
    this.setState({ views: "00",
      maxviews:"00",
      minviews: "00",
      trend: "00",
      yPlot1: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
      xPlot:["January", "February", "March", "April", "May", "June", "July"],
      yPlot2x:['2018-3-12',  '2018-3-13', '2018-3-14',   '2018-3-15',  '2018-3-16',
      '2018-3-17',
      '2018-3-18'],
      yPlot2y:[100, 130, 110, 95, 120, 85, 100, 83, 96, 80, 125]
  })
  }

  render(){
    const isLoading = this.state.isLoading;
    const isPlotLoading = this.state.isPlotLoading;
    const formData = this.state.formData;
    const views = this.state.views;
    const minviews = this.state.minviews;
    const maxviews = this.state.maxviews;
    const trend = this.state.trend;
    const xPlot = this.state.xPlot;
    const yPlot1 = this.state.yPlot1;
    const yPlot2x = this.state.yPlot2x;   
    const yPlot2y = this.state.yPlot2y;

    
  
    let chart1_options = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 2,
        mode: "nearest",
        intersect: Math.min(yPlot1),
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],
      },
    };
    
 
    var articles = []
    articles.push(<option key = {1} value = {'Assassination_of_John_F._Kennedy'}>{'Assassination of John F Kennedy'}</option>);
    articles.push(<option key = {2} value = {'Elon_Musk'}>{'Elon Musk'}</option>);
    articles.push(<option key = {3} value = {'Global_Positioning_System'}>{'Global Positioning System'}</option>);
    articles.push(<option key = {4} value = {'IPhone'}>{'iphone'}</option>);
    articles.push(<option key = {5} value = {'Netflix'}>{'Netflix'}</option>);

    var startDates = []
    for (var month = 1; month <= 12; month = 1 + month) {
      for (var day = 1; day <= 30; day = 1 + day){
      startDates.push(<option key = {month} value = {'2018-'+ month + '-' + day}>{'2018-'+ month + '-' + day}</option>);
    }
    }

    var endDates = []
    for ( month = 1; month <= 12; month = 1 + month){
      for ( day = 1; day <= 30; day = 1 + day){
      endDates.push(<option key = {month} value = {'2018-'+ month + '-' + day}>{'2018-'+ month + '-' + day}</option>);
      }
    }

    var singleDates = []
    for ( month = 1; month <= 12; month = 1 + month) {
      for ( day = 1; day <= 30; day = 1 + day){
      singleDates.push(<option key = {month} value = {'2018-'+ month + '-' + day}>{'2018-'+ month + '-' + day}</option>);
      }
    
    }


    let chart = {
      data1: (canvas) => {
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
    
        return {
          labels: xPlot,
                
          datasets: [
            {
              label: "Monthly Views",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: yPlot1,
            },
          ],
        };
      },

     
      options: {chart1_options}
    };

    let chart2 = {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors
    
        return {
          labels: yPlot2x,
          datasets: [
            {
              label: "Views",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: yPlot2y
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: "#1f8ef1",
          titleFontColor: "#333",
          bodyFontColor: "#1f8ef1",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 60,
                suggestedMax: 120,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
        },
      },
    };

  return (
    <>
      <div className="content">
        <Row >
        
          
          <Col >
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">

                    <CardTitle tag="h2">Web Traffic Forecasting</CardTitle>
                  </Col>
                  {/* <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle"
                      data-toggle="buttons"
                    >
                      <Button
                      style={{float: 'right'}}
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple")}
                         onClick={this.routeChange}
                      >
                        <span>Know more</span>

                      </Button>
                    </ButtonGroup>
                  </Col> */}
                  <CardBody>
                    <div >
                      <p className="text-secondary">
                      This app will forecast the Web Traffic for Wikipedia Articles.
                      The forecasting is done using Facebook's prophet model and can be done for a single day
                                      or an interval of few months. 
                                            {/* <ButtonGroup
                      className="btn-group-toggle"
                      data-toggle="buttons"
                    >
                      <Button
                      style={{float: 'right'}}
                      style={{marginLeft: '20px'}}
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple")}
                         onClick={this.routeChange}
                      >
                        <span>Know more</span>

                      </Button>
                    </ButtonGroup>           */}
                                      </p>
                                      
                                      </div>
                    </CardBody>

                </Row>
              </CardHeader>
              <CardBody>
                

            <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Articles</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.article}
                  name="article"
                  onChange={this.handleChange}>
                  {articles}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Single Forecast</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.singleDate}
                  name="singleDate"
                  onChange={this.handleChange}>
                  {singleDates}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  color="info"
                  size="md"
                  className={classNames("btn-simple")}
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}>
                  { isLoading ? 'Forecasting...' : 'Forecast' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  color="info"
                  size="md"
                  className={classNames("btn-simple")}
                  // disabled={isLoading}
                  onClick={this.handleCancelClick}>
                    <ButtonGroup className="btn-group-toggle"
                      data-toggle="buttons">
                  <span class="resetButton">Reset</span>
                                          </ButtonGroup>
                </Button>
                {/* <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          // active: bigChartData === "data3",
                        })}
                        // onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Sessions
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button> */}
              </Col>
            </Row>
            </Form>
                         
              </CardBody>
            </Card>
          </Col>

          <Col>
          <Card className="card-chart">
            <CardHeader>
            <Row>
              <Col className="text-left" sm="6">
                
                <CardTitle >
                  
                <h5 className="card-category">Views of the week</h5>
                </CardTitle>
                    The trend for the whole week of {formData.singleDate}
              </Col>
            </Row>
            </CardHeader>
            <CardBody>
                           <div className="chart-area">
                  <Bar
                    data={chart2.data}
                    options={chart2.options}
                  />
                </div>
                </CardBody>
          </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="3">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Views</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> {views}
                
                </CardTitle>
 
              </CardHeader>
              <CardBody>
               
              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Maximum Views</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />
                  {maxviews}
                </CardTitle>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Minimum Views</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />
                  {minviews}
                </CardTitle>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Trend</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> {trend}
                </CardTitle>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col >
          <Card className="card-chart">
      <CardHeader>
                <h5 className="card-category">Monthly Resampled PLot</h5>
        <CardTitle tag="h3">
          <Col sm="3">
            <Form>
            <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>Start</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.startDate}
                  name="startDate"
                  onChange={this.handleChange}>
                  {startDates}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>End</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.endDate}
                  name="endDate"
                  onChange={this.handleChange}>
                  {endDates}
                </Form.Control>
                
              </Form.Group>
              <Col >
                <Button
                style={{float: 'right'}}
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple")}
                        disabled={isPlotLoading}
                  onClick={!isPlotLoading ? this.handlePlotClick : null}
                      >
                        <ButtonGroup
                      className="btn-group-toggle"
                      data-toggle="buttons">
                        <span>{ isPlotLoading ? 'Plotting...' : 'Plot' }</span>


  
                        </ButtonGroup>
                      </Button>
                      </Col>
              </Form.Row>
              </Form>
              
              </Col>
             
                                   
                </CardTitle>
          </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chart.data1}
                    
                    options={chart.options.chart1_options}
                  />
                     
                </div>
              </CardBody>
          </Card>
          </Col>
        </Row>
                
      </div>
    </>
  );
  }
  
}


export default App;
