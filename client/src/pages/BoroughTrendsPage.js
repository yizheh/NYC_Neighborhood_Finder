import React from 'react';
import {
  Table,
  Select
} from 'antd';
import MenuBar from '../components/MenuBar';
import { getBoroughTrends } from '../fetcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Option } = Select;

class BoroughTrendsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      boroughTrendsResults: [],

    }

    this.boroughOnChange = this.boroughOnChange.bind(this)

  }


  componentDidMount() {

    getBoroughTrends('Bronx').then(res => {
      this.setState({ boroughTrendsResults: res.results })
        console.log(this.state.boroughTrendsResults)

    })
    
  }

  boroughOnChange(value) {

    getBoroughTrends(value).then(res => {
      this.setState({ boroughTrendsResults: res.results })
    })
  }


  render() {

    return (

      <div>
      <MenuBar />
      
      <img src="/images/park.jpeg" style={{ width: '100vw' }}/>

      <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

        <h4 style={{ fontSize: '40px', marginTop: '5vh', marginBottom: '5vh'}}>Borough Trends</h4>

      <div style={{ marginBottom: '2vh' }}>
        <Select defaultValue={'Bronx'} style={{ width: 140 }} onChange={this.boroughOnChange}>
            <Option value={'Bronx'}>Bronx</Option>
            <Option value={'Brooklyn'}>Brooklyn</Option>
            <Option value={'Manhattan'}>Manhattan</Option>
            <Option value={'Queens'}>Queens</Option>
            <Option value={'Staten Island'}>Staten Island</Option>
        </Select>
        </div>
    </div>


    <div style={{ width: '45vw', float: 'left', margin: '0 auto', marginTop: '2vh', marginLeft: '5vh', paddingBottom: '4vh' }}>

      <h4 style={{textAlign: 'center'}}>Rent Over Time</h4>

      <ResponsiveContainer width='100%' aspect={2.5}>
        <LineChart
          width={500}
          height={300}
          data={this.state.boroughTrendsResults}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='Year' />
          <YAxis domain={[1200, 3700]}/>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value)}/>
          <Line dataKey='Average_Rent' name='Average Rent' fill='#007bff' />
        </LineChart>
      </ResponsiveContainer>

    </div>


    <div style={{ width: '45vw', float: 'right', margin: '0 auto', marginTop: '2vh', marginRight: '5vh', paddingBottom: '4vh' }}>

      <h4 style={{textAlign: 'center'}}>Crime Count Over Time</h4>

      <ResponsiveContainer width='100%' aspect={2.5}>
        <LineChart
          width={500}
          height={300}
          data={this.state.boroughTrendsResults}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='Year' />
          <YAxis domain={[10000, 150000]}/>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
          <Line dataKey='Crime_Count' name='Crime Count' fill='#007bff' />
        </LineChart>
      </ResponsiveContainer>

    </div>

  </div>

    )
  }

}

export default BoroughTrendsPage