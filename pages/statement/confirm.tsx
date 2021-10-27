import { useState, useContext } from 'react';
import { useRouter } from 'next/router'
import {
  Container,
  Header,
  Content,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  ButtonToolbar,
  Button,
  Schema,
  Message,
  Alert,
} from 'rsuite';
import Navigation from '../../components/Navigation';

import { TokenContext } from '../../store/index';

const apiConfig = process.env.apiConfig;

const ConfirmStatement: React.FunctionComponent = () => {
  const [tokenState] = useContext(TokenContext);

  const router = useRouter()

  const { StringType } = Schema.Types;
  const model = Schema.Model({
    ticketNo: StringType().isRequired('Please enter your ticket no'),
    password: StringType().isRequired('please enter your password'),
  });

  const [ticketNo, setTicketNo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formValue = {
    ticketNo,
    password,
  };

  const requestStatementForm = async (valid) => {
    if (valid) {
      console.log(formValue);
      setIsFormSubmitted(true);

      try {
        let res = await fetch('/api/statement', {
          method: 'POST',
          body: JSON.stringify({ ...formValue, name: tokenState.name }),
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Client-ID': apiConfig['Client-ID'],
            'Client-Secret': apiConfig['Client-Secret'],
          },
        });

        const body = await res.json();
        console.log('Response', res, );
        if (body && body.status === 200) {
          setIsFormSubmitted(false);
          setTicketNo('');
          setPassword('');
          formValue.ticketNo = '';
          formValue.password = '';
          Alert.success('Your Statement has been confirmed', 4000);
        } else {
          throw new Error(
            body.message
          );
        }
      } catch (error) {
        let msg;

        if(error && (error.message === 'PDF file not found') ) {
            msg = error.message  + '\n Please submit your ticket again in to regenerate!'
        } else {
            msg = error.message
        }

        Alert.error(msg, 4000);
        setIsFormSubmitted(false);
      }
    }
  };


  function renderMessage(router) {
    if(router && router.query && router.query.status) {
          switch (router.query.status) {
            case 'PhoneInvalid':
              return  (
                <Message
                showIcon
                type='error'
                title='Confirm Statement'
                description= {router.query.feedback && router.query.feedback}
                className='my-5'
              />
              )
           case 'noPhone':
            return  (
              <Message
              showIcon
              type='warning'
              title='Confirm Statement'
              description={router.query.feedback && router.query.feedback}
              className='my-5'
            />
            )
           case 'Pending':
            return  (
              <Message
              showIcon
              type='info'
              title='Confirm Statement'
              description={router.query.feedback && router.query.feedback}
              className='my-5'
            />
            )
            default:
              return  (
                <Message
                showIcon
                type='info'
                title='Confirm Statement'
                description='Please enter the ticket number and the password, that was sent to you via sms.'
                className='my-5'
              />
              )
          }
    } else {
          return  (
            <Message
            showIcon
            type='info'
            title='Confirm Statement'
            description='Please enter the ticket number and the password, that was sent to you via sms.'
            className='my-5'
          />
          )
    }
     
  }

  return (
    <Container>
      <Header>
        <Navigation />
      </Header>

      <Content>
        <div className='container d-flex justify-content-center align-items-center flex-column mb-5'>
          
         {renderMessage(router)}
          <div>
            <div className='row'>
              <Form
                model={model}
                formValue={formValue}
                onSubmit={requestStatementForm}
              >
                <FormGroup>
                  <ControlLabel>Ticket Number</ControlLabel>
                  <FormControl
                    name='ticketNo'
                    onChange={(value) => setTicketNo(value)}
                  />
                  <HelpBlock tooltip>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    name='password'
                    onChange={(value) => setPassword(value)}
                    type='password'
                  />
                  <HelpBlock tooltip>Required</HelpBlock>
                </FormGroup>

                <FormGroup>
                  <ButtonToolbar>
                    <Button
                      block
                      appearance='primary'
                      type='submit'
                      loading={isFormSubmitted}
                    >
                      Submit
                    </Button>
                  </ButtonToolbar>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </Content>
    </Container>
  );
};

export default ConfirmStatement;
