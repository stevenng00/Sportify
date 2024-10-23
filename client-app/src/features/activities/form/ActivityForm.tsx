import React, { act, ChangeEvent, useEffect, useState } from 'react';
import { Button, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {v4 as uuid} from 'uuid';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';



export default observer (function ActivityForm(){

    const{activityStore} = useStore();
    const{selectedActivity, createActivity, updateActivity, loading, 
        loadActivity, loadingInitial}= activityStore;

    const{id} = useParams();
    const navigate =  useNavigate();

    const[activity, setActivity] = useState<Activity>({
        id:'',
        title:'',
        category:'',
        description:'',
        date:'',
        city:'',
        venue:''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required.'),
        description: Yup.string().required('The activity description is required.'),
        category: Yup.string().required(),
        date: Yup.string().required(),
        venue: Yup.string().required(),
        city: Yup.string().required(),


    })

    useEffect(()=>{
        if(id) loadActivity(id).then(activity => setActivity(activity!))
    },[id, loadActivity]);

    // function handleSubmit(){
    //     if(!activity.id){
    //         activity.id = uuid();
    //         createActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
    //     }else{
    //         updateActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
    //     }
    // }

    // function handleChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    //     const {name, value} = event.target;
    //     setActivity({...activity,[name]:value  })
    // }

    if(loadingInitial) return <LoadingComponent content='Loading activity...'/>

    return(
        <Segment clearing> 
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize 
            initialValues={activity}
            onSubmit={values => console.log(values)}>
                {({ values:activity,handleChange, handleSubmit}) =>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                       <MyTextInput name='title' placeholder='Title'/>
                       <MyTextArea rows={3} placeholder='Description'  name='description' />
                       <MyTextInput placeholder='Category' name='category' />
                       <MyTextInput placeholder='Date'  name='date' />
                       <MyTextInput placeholder='City'  name='city' />
                       <MyTextInput placeholder='Veneu'  name='venue' />
                       <Button loading={loading} floated='right' positive type="submit" content="Submit"/>
                       <Button as={Link} to='/activities'  floated='right' type="submit" content="Cancel"/>
                   </Form>
                )}
            </Formik>
         
        </Segment>
    )
})