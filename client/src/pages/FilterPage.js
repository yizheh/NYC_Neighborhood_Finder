import React from 'react';

import MenuBar from '../components/MenuBar';
import { getFilteredRents, getFilteredCrime } from '../fetcher'

import { Form, FormInput, FormGroup, Button } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Radio,
    Slider,
    Rate
} from 'antd'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const rentColumns = [
    {
      title: 'Neighborhood',
      dataIndex: 'Neighborhood',
      key: 'Neighborhood',
      sorter: (a, b) => a.Neighborhood.localeCompare(b.Neighborhood),
      render: (text, row) => <a href={`/search?id=${row.Neighborhood}`}>{text}</a>
    },
    {
        title: 'Average Rent',
        dataIndex: 'AverageRent',
        key: 'AverageRent',
        sorter: (a, b) => parseFloat(a.AverageRent.replace(/,/g, '').replace('$', '')) - parseFloat(b.AverageRent.replace(/,/g, '').replace('$', ''))
      },
    {
        title: 'Lowest Rent',
        dataIndex: 'LowestRent',
        key: 'LowestRent',
        sorter: (a, b) => parseFloat(a.LowestRent.replace(/,/g, '').replace('$', '')) - parseFloat(b.LowestRent.replace(/,/g, '').replace('$', ''))
      },
    {
        title: 'Highest Rent',
        dataIndex: 'HighestRent',
        key: 'HighestRent',
        sorter: (a, b) => parseFloat(a.HighestRent.replace(/,/g, '').replace('$', '')) - parseFloat(b.HighestRent.replace(/,/g, '').replace('$', ''))
      },
    {
      title: 'Rent Range',
      dataIndex: 'RentRange',
      key: 'RentRange',
      sorter: (a, b) => parseFloat(a.RentRange.replace(/,/g, '').replace('$', '')) - parseFloat(b.RentRange.replace(/,/g, '').replace('$', ''))
    }
];


const crimeColumns = [
    {
      title: 'Neighborhood',
      dataIndex: 'Neighborhood',
      key: 'Neighborhood',
      sorter: (a, b) => a.Neighborhood.localeCompare(b.Neighborhood),
      render: (text, row) => <a href={`/search?id=${row.Neighborhood}`}>{text}</a>
    },
    {
        title: 'Offense Count',
        dataIndex: 'Offense_Count',
        key: 'Offense_Count',
        sorter: (a, b) => parseFloat(a.Offense_Count.replace(/,/g, '').replace('$', '')) - parseFloat(b.Offense_Count.replace(/,/g, '').replace('$', ''))
    },
    {
        title: 'Gender Victimizations',
        dataIndex: 'Gender_Victimizations',
        key: 'Gender_Victimizations',
        sorter: (a, b) => parseFloat(a.Gender_Victimizations.replace(/,/g, '').replace('$', '')) - parseFloat(b.Gender_Victimizations.replace(/,/g, '').replace('$', ''))
    },
    {
        title: 'Age Group Victimizations',
        dataIndex: 'Age_Group_Victimizations',
        key: 'Age_Group_Victimizations',
        sorter: (a, b) => parseFloat(a.Age_Group_Victimizations.replace(/,/g, '').replace('$', '')) - parseFloat(b.Age_Group_Victimizations.replace(/,/g, '').replace('$', ''))
    },
];

class FilterPage extends React.Component {

    constructor(props) {
      super(props)
  
      this.state = {
        minrent: '',
        maxrent: '',
        rentResults: [],

        offenselevel: 'Felony',
        offensenumresults: 1,
        gender: 'M',
        gendernumresults: 1,
        agerange: '<18',
        agenumresults: 1,
        order: 'ASC',
        crimeResults: [],
      }
  
      this.handleMinRentChange = this.handleMinRentChange.bind(this)
      this.handleMaxRentChange = this.handleMaxRentChange.bind(this)
      this.updateRentSearchResults = this.updateRentSearchResults.bind(this)

      this.handleOffenseChange = this.handleOffenseChange.bind(this)
      this.handleOffenseLimitChange = this.handleOffenseLimitChange.bind(this)

      this.handleGenderChange = this.handleGenderChange.bind(this)
      this.handleGenderLimitChange = this.handleGenderLimitChange.bind(this)

      this.handleAgeRangeChange = this.handleAgeRangeChange.bind(this)
      this.handleAgeLimitChange = this.handleAgeLimitChange.bind(this)

      this.handleOrderChange = this.handleOrderChange.bind(this)
      this.updateCrimeSearchResults = this.updateCrimeSearchResults.bind(this)

    }

    componentDidMount() {

        getFilteredRents(0, Number.MAX_SAFE_INTEGER).then(res => {
            this.setState({ rentResults: res.results })
        })

        getFilteredCrime('Felony', 1, 'M', 1, '<18', 1, 'ASC').then(res => {
            this.setState({crimeResults: res.results})
        })
    }

    handleMinRentChange(event) {

        this.setState({ minrent: event.target.value})
    }

    handleMaxRentChange(event) {

        this.setState({ maxrent: event.target.value})
    }
  
    updateRentSearchResults() {

        getFilteredRents(this.state.minrent, this.state.maxrent).then(res => {
            this.setState({ rentResults: res.results })
            console.log(this.state.minrent)
            console.log(this.state.maxrent)
        })
    }

    handleOffenseChange(value) {

        this.setState({ offenselevel: value})
    }

    handleOffenseLimitChange(value) {

        this.setState({ offensenumresults: value})
    }

    handleOrderChange(event) {

        this.setState({ order: event.target.value})
    }

    handleGenderChange(value) {

        this.setState({ gender: value})
    }

    handleGenderLimitChange(value) {

        this.setState({ gendernumresults: value})
    }

    handleAgeRangeChange(value) {

        this.setState({ agerange: value})
    }

    handleAgeLimitChange(value) {

        this.setState({ agenumresults: value})
    }

    updateCrimeSearchResults() {

        console.log(this.state.offenselevel)
        console.log(this.state.offensenumresults)
        console.log(this.state.gender)
        console.log(this.state.gendernumresults)
        console.log(this.state.agerange)
        console.log(this.state.agenumresults)
        console.log(this.state.order)

        getFilteredCrime(this.state.offenselevel, this.state.offensenumresults, this.state.gender, this.state.gendernumresults, this.state.agerange, this.state.agenumresults, this.state.order).then(res => {

            this.setState({ crimeResults: res.results })

            console.log(this.state.crimeResults)
        })
    }
  
    render() {
  
      return (
        <div>
        <MenuBar />

        <img src="/images/NightSkyline.jpg" style = {{width: '100vw', height: '35vw'}}/>

        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh', paddingBottom: '4vh' }}>

            <h4 style = {{fontSize: '40px', marginTop: '5vh', marginBottotm: '1vh', textAlign: 'center' }}>Rent Filtering</h4>

                <Form style={{ width: '70vw', margin: '0 auto', marginTop: '4vh' }}>
                    <Row>
                        <Col><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                            <FormInput placeholder="Minimum Rent" onChange={this.handleMinRentChange} />
                        </FormGroup></Col>
                        <Col><FormGroup style={{ width: '15vw', margin: '0 auto', marginLeft: '13vw' }}>
                            <FormInput placeholder="Maximum Rent" onChange={this.handleMaxRentChange} />
                        </FormGroup></Col>
                        <Col><FormGroup style={{ width: '0vw', margin: '0 auto', marginLeft: '22vw' }}>
                            <Button style={{ marginTop: '0vh' }} onClick={this.updateRentSearchResults}>Search</Button>
                        </FormGroup></Col>
                    </Row>
                </Form>

            <Divider />

            <Table dataSource={this.state.rentResults} columns={rentColumns} pagination={{ defaultPageSize: 5, showQuickJumper:true }}></Table>

            <Divider />

            <h4 style = {{fontSize: '40px', marginTop: '5vh', marginBottotm: '1vh', textAlign: 'center' }}>Crime Filtering</h4>

            <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh', marginLeft: '9vw' }}>
                    <Row style={{marginBottom: 8, marginLeft: '10vw', marginRight: '25vw'}}>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <Select defaultValue="Felony" style={{ width: '10.5vw' }} onChange={this.handleOffenseChange}>
                                <Option value="Felony">Felony</Option>
                                <Option value="Misdemeanor">Misdemeanor</Option>
                                <Option value="Violation">Violation</Option>
                            </Select>
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <Select defaultValue={1} style={{ width: '6.5vw' }} onChange={this.handleOffenseLimitChange}>
                            <Option value={1}>Top 1</Option>
                            <Option value={5}>Top 5</Option>
                            <Option value={10}>Top 10</Option>
                            <Option value={Number.MAX_SAFE_INTEGER}>All</Option>
                        </Select>
                        </FormGroup></Col>
                    </Row>
                    <Row style={{marginBottom: 8, marginLeft: '10vw', marginRight: '25vw'}}>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <Select defaultValue="M" style={{ width: '10.5vw' }} onChange={this.handleGenderChange}>
                                <Option value="M">Male</Option>
                                <Option value="F">Female</Option>
                            </Select>
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <Select defaultValue={1} style={{ width: '6.5vw' }} onChange={this.handleGenderLimitChange}>
                            <Option value={1}>Top 1</Option>
                            <Option value={5}>Top 5</Option>
                            <Option value={10}>Top 10</Option>
                            <Option value={Number.MAX_SAFE_INTEGER}>All</Option>
                        </Select>
                        </FormGroup></Col>
                    </Row>
                    <Row style={{marginBottom: 8, marginLeft: '10vw', marginRight: '25vw'}}>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <Select defaultValue="%3C18" style={{ width: '10.5vw' }} onChange={this.handleAgeRangeChange}>
                                <Option value="%3C18">Under 18</Option>
                                <Option value="18%2D24">18-24</Option>
                                <Option value="25%2D44">25-44</Option>
                                <Option value="45%2D64">45-64</Option>
                                <Option value="65%2B">65+</Option>
                            </Select>
                            </FormGroup></Col>
                            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <Select defaultValue={1} style={{ width: '6.5vw' }} onChange={this.handleAgeLimitChange}>
                            <Option value={1}>Top 1</Option>
                            <Option value={5}>Top 5</Option>
                            <Option value={10}>Top 10</Option>
                            <Option value={Number.MAX_SAFE_INTEGER}>All</Option>
                        </Select>
                        </FormGroup></Col>
                    </Row>
                    <Row style = {{marginTop: '2vw', marginLeft: '10vw', marginRight: '25vw'}}>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <Radio.Group
                            options={
                                [
                                    {label: 'Lowest', value: 'ASC'},
                                    {label: 'Highest', value: 'DESC'},
                                ]
                            }
                            onChange={this.handleOrderChange}
                            defaultValue="ASC"
                            optionType="button"
                            buttonStyle="solid"
                            />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '16vw' }}>
                            <Button style={{ marginTop: '0vh' }} onClick={this.updateCrimeSearchResults}>Search</Button>
                        </FormGroup></Col>
                    </Row>
                </Form>

            <Divider />
            <Table dataSource={this.state.crimeResults} columns={crimeColumns} pagination={{ defaultPageSize: 5, showQuickJumper:true }}></Table>
        </div>
        </div>
      )
    }
  
  }
  
  export default FilterPage