import React from 'react';
import { Button, Container, Menu, MenuItem } from 'semantic-ui-react';
import { useStore } from '../stores/store';



export default function Navbar(){

    const{activityStore} = useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <MenuItem header><img src='/assets/logo.png' style={{marginRight:'10px'}}/>Sportify</MenuItem>
                <MenuItem name='Activities'></MenuItem>
                <MenuItem><Button onClick={() => activityStore.openForm()} positive content='Create Activity'/></MenuItem>
            </Container>
        </Menu>
    )
}