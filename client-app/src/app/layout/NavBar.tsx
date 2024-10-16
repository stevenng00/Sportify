import React from 'react';
import { Button, Container, Menu, MenuItem } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';



export default function Navbar(){

    return(
        <Menu inverted fixed='top'>
            <Container>
                <MenuItem as={NavLink} to='/' header><img src='/assets/logo.png' style={{marginRight:'10px'}}/>Sportify</MenuItem>
                <MenuItem as={NavLink} to='/activities' name='Activities'></MenuItem>
                <MenuItem as={NavLink} to='/createActivity'><Button positive content='Create Activity'/></MenuItem>
            </Container>
        </Menu>
    )
}