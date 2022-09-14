import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    // Dropdown,
    // DropdownToggle,
    // DropdownMenu,
    // DropdownItem
  } from "shards-react";

class MenuBar extends React.Component {

// dropdown code begins

  // constructor(props) {
  //   super(props);

  //   this.toggleDropdown = this.toggleDropdown.bind(this);
  //   this.toggleNavbar = this.toggleNavbar.bind(this);

  //   this.state = {
  //     dropdownOpen: false,
  //     collapseOpen: false
  //   };
  // }

  // toggleDropdown() {
  //   this.setState({
  //     ...this.state,
  //     ...{
  //       dropdownOpen: !this.state.dropdownOpen
  //     }
  //   });
  // }

  // toggleNavbar() {
  //   this.setState({
  //     ...this.state,
  //     ...{
  //       collapseOpen: !this.state.collapseOpen
  //     }
  //   });
  // }

  // dropdown code ends

    render() {
        return(

      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/dashboard">NYC Neighborhood Finder</NavbarBrand>
          <Nav navbar>
          <NavItem>
            <NavLink active href="/dashboard">
                Dashboard
              </NavLink>
          </NavItem>
          <NavItem>
              <NavLink active href="/borough/summary">
                Borough Info
              </NavLink>
            </NavItem>
          <NavItem>
            <NavLink active href="/filter">
                Filter
              </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/search">
                Search
            </NavLink>
          </NavItem>
            {/* <Dropdown open={this.state.dropdownOpen} toggle={this.toggleDropdown}>
              <DropdownToggle nav caret>
                Trends
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/trends/borough">By Borough</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            {/* <NavItem>
              <NavLink active href="/players">
                Players
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/matches" >
                Matches
              </NavLink>
            </NavItem> */}
          </Nav>
      </Navbar>

        )
    }
}

export default MenuBar
