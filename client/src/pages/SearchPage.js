import React from 'react';
import {
  Table,
  Select,
  Divider,
  Row,
  Col
} from 'antd';
import MenuBar from '../components/MenuBar';
import { getSearchName, getNeighborhood, getNeighborhoodRank } from '../fetcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "shards-react";
import { Form, FormInput, FormGroup, Card, CardBody, CardTitle, Progress } from "shards-react";



const { Option } = Select;


const NeighborhoodhSummaryColumns = [
  {
    title: 'Neighborhood',
    dataIndex: 'Neighborhood',
    key: 'Neighborhood',
    sorter: (a, b) => a.Neighborhood.localeCompare(b.Neighborhood),
    render: (text, row) => <a href={`/search?id=${row.Neighborhood}`}>{text}</a>
  },
  {
    title: 'Number Of Zip Codes',
    dataIndex: 'NumZipCodes',
    key: 'NumZipCodes',
    sorter: (a, b) => a.NumZipCodes - b.NumZipCodes
  },
  {
    title: 'Zipcodes',
    dataIndex: 'ZipCodes',
    key: 'ZipCodes',
    sorter: (a, b) => a.Neighborhood.localeCompare(b.Neighborhood),
  }
];


const SelectedSummaryColumns = [
  {
    title: 'Neighborhood',
    dataIndex: 'Neighborhood',
    key: 'Neighborhood',
    sorter: (a, b) => a.Neighborhood.localeCompare(b.Neighborhood)
  },
  {
    title: 'Month',
    dataIndex: 'Month',
    key: 'Month',
    sorter: (a, b) => a.Month - b.Month
  },
  {
    title: 'Year',
    dataIndex: 'Year',
    key: 'Year',
    sorter: (a, b) => a.Year - b.Year
  },
  {
    title: 'Average Rent',
    dataIndex: 'AvgRent',
    key: 'AvgRent',
    sorter: (a, b) => a.AvgRent - b.AvgRent
  }
];

const RankColumns = [
  {
    title: 'Neighborhood',
    dataIndex: 'Neighborhood',
    key: 'Neighborhood'
  },
  {
    title: 'Crime Rank In Borough',
    dataIndex: 'TRank',
    key: 'TRank'
  },
  {
    title: 'Felony Rank In Borough',
    dataIndex: 'FRank',
    key: 'FRank'
  },
  {
    title: 'Misdemeanor Rank In Borough',
    dataIndex: 'MRank',
    key: 'MRank'
  },
  {
    title: 'Rent Rank In Borough',
    dataIndex: 'RentRank',
    key: 'RentRank'
  },
  {
    title: 'Most Common Felony',
    dataIndex: 'FMOST',
    key: 'FMOST'
  },
  {
    title: 'Most Common Misdemeanor',
    dataIndex: 'MMOST',
    key: 'MMOST',
  }
];

class SearchPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      nameQuery: '',
      neighborhoodResults: [],
      selectedNeighborhoodId: window.location.search ? window.location.search.substring(1).split('=')[1] : null,
      selectedNeighborhoodDetails: [],
      selectedNeighborhoodRanks : []
    }
    this.updateSearchResults = this.updateSearchResults.bind(this)
    this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
    // this.handleSelectedChange = this.handleSelectedChange.bind(this)
    // this.updateSelectedhResults = this.updateSelectedhResults.bind(this)

  }

handleNameQueryChange(event) {
  this.setState({ nameQuery: event.target.value })
}

updateSearchResults() {
  getSearchName(this.state.nameQuery).then(res => {
      this.setState({ neighborhoodResults: res.results })
  })

}

componentDidMount() {
  console.log("Neghborhood id is: ");
  console.log(this.state.selectedNeighborhoodId)
  getSearchName(this.state.nameQuery).then(res => {
    this.setState({ neighborhoodResults: res.results })
})
  if (this.state.selectedNeighborhoodId)
  {
    getNeighborhoodRank(this.state.selectedNeighborhoodId).then(res =>{
      this.setState({selectedNeighborhoodRanks: res.results})
    })
    getNeighborhood(this.state.selectedNeighborhoodId).then(res =>{
      this.setState({ selectedNeighborhoodDetails: res.results})  
    })
  }
}

  render() {
    return (
      <div>
          <MenuBar />
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
              <Row>
                  <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                      <label>Name</label>
                      <FormInput placeholder="Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                  </FormGroup></Col>
                  <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                      <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                  </FormGroup></Col>
              </Row>
              <br></br>     
          </Form>
          <Divider />
          <Table dataSource={this.state.neighborhoodResults} columns={NeighborhoodhSummaryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/>
          <Divider />
          <div>
          {/* <Table dataSource={this.state.selectedNeighborhoodDetails} columns={SelectedSummaryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/> */}
          
          </div>
          <div style={{margin: '0 auto', marginTop: '2vh', marginLeft: '5vh'}}>

<h4 style={{textAlign: 'center'}}>{this.state.selectedNeighborhoodId ? decodeURI(this.state.selectedNeighborhoodId) : ""}: Rent and Crime Over Time </h4>
<ResponsiveContainer width='100%' aspect={2.5}>
  <LineChart
    width={500}
    height={300}
    data={this.state.selectedNeighborhoodDetails}
  >
    <CartesianGrid strokeDasharray='3 3' />
    <XAxis dataKey="date" tick={false} />
    <YAxis yAxisId="left" domain={['dataMin - 100', 'dataMax + 100']} />
    <YAxis yAxisId="right" orientation="right" domain={['dataMin - 100', 'dataMax + 100']} />
    <Legend />
    <Tooltip formatter={(value, name) => (name == "Average Rent") ? new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value): value}/>
    <Line yAxisId="left" dataKey='AvgRent' name='Average Rent' fill='#007bff' />
    <Line yAxisId="right" dataKey='Crime_Count' name='Crime Count' fill='#00FF00' />
  </LineChart>
</ResponsiveContainer>
<div>
       <Table dataSource={this.state.selectedNeighborhoodRanks} columns={RankColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/>
</div>

</div>
          {/* {this.state.selectedNeighborhoodDetails ? <div style={{ width: '45vw', float: 'left', margin: '0 auto', marginTop: '2vh', marginLeft: '5vh'}}> */}
            {/* <h4 style={{textAlign: 'center'}}>Rent Over Time</h4>
            <ResponsiveContainer width='100%' aspect={2.5}>
              <LineChart
                width={500}
                height={300}
                data={this.state.boroughTrendsResults}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='Year' />
                <YAxis domain={[1200, 3700]}/>
                <Tooltip formatter={(value) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value)}/>
                <Line dataKey='Average_Rent' name='Average Rent' fill='#007bff' />
              </LineChart>
            </ResponsiveContainer> */}
             {/* <Table dataSource={this.state.selectedNeighborhoodDetails} columns={SelectedSummaryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/> */}
            {/* </div> : null} */}
        
        </div>
  )
}
}

export default SearchPage