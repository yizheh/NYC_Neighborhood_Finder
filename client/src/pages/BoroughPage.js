import React from 'react';
import {
  Table,
  Select,
  Divider
} from 'antd';
import MenuBar from '../components/MenuBar';
import { getBoroughSummary } from '../fetcher';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Button } from "shards-react";

const { Option } = Select;


const boroughSummaryColumns = [
  {
    title: 'Borough',
    dataIndex: 'Borough',
    key: 'Borough',
    sorter: (a, b) => a.Borough.localeCompare(b.Borough)
  },
  {
    title: 'Average Rent',
    dataIndex: 'Average_Rent',
    key: 'Average_Rent',
    sorter: (a, b) => parseFloat(a.Average_Rent.replace(/,/g, '').replace('$', '')) - parseFloat(b.Average_Rent.replace(/,/g, '').replace('$', ''))
  },
  {
    title: 'Crime Count',
    dataIndex: 'Crime_Count',
    key: 'Crime_Count',
    sorter: (a, b) => parseFloat(a.Crime_Count.replace(/,/g, '').replace('$', '')) - parseFloat(b.Crime_Count.replace(/,/g, '').replace('$', ''))
    
  }
];

class BoroughPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      boroughSummaryResults: [],
      boroughGraphResults: []
    }

    this.yearOnChange = this.yearOnChange.bind(this)

  }


  componentDidMount() {

    getBoroughSummary(2020, 'table').then(res => {
      this.setState({ boroughSummaryResults: res.results })

    })
    
    getBoroughSummary(2020, 'graph').then(res => {
      this.setState({ boroughGraphResults: res.results })

    })
    
  }

  yearOnChange(value) {

    getBoroughSummary(value, 'table').then(res => {
      this.setState({ boroughSummaryResults: res.results })

    })
    
    getBoroughSummary(value, 'graph').then(res => {
      this.setState({ boroughGraphResults: res.results })

    })

  }


  render() {


    return (

      <div>

      <MenuBar />

      <img src="/images/brooklyn4k.jpeg" style={{ width: '100vw' }}/>

      <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

        <div style={{ marginTop: '2vh', marginBottom: '2vh' }}>

          <h4 style={{ fontSize: '40px', marginTop: '5vh', marginBottom: '5vh'}}>Borough Information</h4>

        </div>
      

        <div style={{ width: '7vw', float: 'left', marginBottom: '2vh', marginTop: '0.5vh' }}>
        <Select defaultValue={2020} style={{ width: 120 }} onChange={this.yearOnChange}>
          <Option value={2020}>2020</Option>
          <Option value={2019}>2019</Option>
          <Option value={2018}>2018</Option>
          <Option value={2017}>2017</Option>
          <Option value={2016}>2016</Option>
          <Option value={2015}>2015</Option>
          <Option value={2014}>2014</Option>
          <Option value={2013}>2013</Option>
          <Option value={2012}>2012</Option>
          <Option value={2011}>2011</Option>
          <Option value={2010}>2010</Option>
        </Select>
        </div>

        <div style={{ width: '8vw', float: 'left', marginBottom: '2vh'}}>
          <Button variant="outline-primary" href="/borough/trends">Trends Page</Button>
        </div>

        <Divider />

        <Table dataSource={this.state.boroughSummaryResults} columns={boroughSummaryColumns} pagination={false}></Table>

        <Divider />

      </div>

      

    <div style={{ width: '35vw', float: 'left', margin: '0 auto', marginTop: '2vh', marginLeft: '23vh', paddingBottom: '4vh' }}>

      <h4 style={{textAlign: 'center'}}>Average Rent</h4>

      <ResponsiveContainer width='100%' aspect={2.5}>
        <BarChart
          width={500}
          height={300}
          data={this.state.boroughGraphResults}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='Borough' />
          <YAxis domain={[0, 3700]}/>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value)}/>
          <Bar dataKey='Average_Rent' name='Average Rent' fill='#007bff' />
        </BarChart>
      </ResponsiveContainer>

    </div>


    <div style={{ width: '35vw', float: 'right', margin: '0 auto', marginTop: '2vh', marginRight: '29vh', paddingBottom: '4vh' }}>

      <h4 style={{textAlign: 'center'}}>Crime Count</h4>

      <ResponsiveContainer width='100%' aspect={2.5}>
        <BarChart
          width={500}
          height={300}
          data={this.state.boroughGraphResults}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='Borough' />
          <YAxis domain={[0, 145000]}/>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
          <Bar dataKey='Crime_Count' name='Crime Count' fill='#007bff' />
        </BarChart>
      </ResponsiveContainer>

    </div>



  </div>

    )
  }

}

export default BoroughPage
