import React, { useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Grid, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSlidebar from './ActivityDetailedSlidebar';



export default observer( function ActivityDetails(){
    const{activityStore} = useStore();
    const {selectedActivity:activity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();

    useEffect(()=>{
        if(id) loadActivity(id);
    },[id,loadActivity])

    if(loadingInitial || !activity) return <LoadingComponent/>;

    return(
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader/>
                <ActivityDetailedInfo/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSlidebar/>
            </Grid.Column>
        </Grid>
    )
})