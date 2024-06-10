import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { Segment } from 'semantic-ui-react';

function MyChatBot() {

    const steps = [
        {
            id: 'Greet',
            message: 'Hello,Welcome to help desk support',
            trigger: 'Ask Name',
        },
        {
            id: 'Ask Name',
            message: 'Please enter your name',
            trigger: 'waiting1',
        },
        {
            id: 'waiting1',
            user: true,
            trigger: 'Name',
        },
        {
            id: 'Name',
            message: 'Hi {previousValue},Please select your issue',
            trigger: 'issues',
        },
        {
            id: 'issues',
            options: [
                { value: 'React', label: 'React', trigger: 'React' },
                { value: 'Angular', label: 'Angular', trigger: 'Angular' },
            ],
        },
        {
            id: 'React',
            message: 'Thanks for telling your react issue',
            end: true
        },
        {
            id: 'Angular',
            message: 'Thanks for telling your angular issue',
            end: true
        }
    ];

    return (
        <>
            <Segment floated="right">

                <ChatBot steps={steps} />
            </Segment>
        </>
    )
}

export default MyChatBot