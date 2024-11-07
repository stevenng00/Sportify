import React from 'react';
import { Button, Container, Menu, MenuItem, Image, Dropdown, DropdownItem } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';



export default observer(function Navbar(){
    const {userStore:{user,logout}} = useStore();
    return(
        <Menu inverted fixed='top'>
            <Container>
                <MenuItem as={NavLink} to='/' header><img src='/assets/logo.png' style={{marginRight:'10px'}}/>Sportify</MenuItem>
                <MenuItem as={NavLink} to='/activities' name='Activities'></MenuItem>
                <MenuItem as={NavLink} to='/errors' name='Errors'></MenuItem>

                <MenuItem as={NavLink} to='/createActivity'><Button positive content='Create Activity'/></MenuItem>
                <MenuItem position='right'>
                    <Image src={user?.image || 'assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
})