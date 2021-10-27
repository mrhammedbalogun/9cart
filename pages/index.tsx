import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import {
  Header,
  Button,
  Col,
  Container,
  FlexboxGrid,
  Content,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
  SelectPicker,
  // DateRangePicker,
  DatePicker,
  Schema,
  Alert,
} from 'rsuite';

import Navigation from '../components/Navigation';
import ModalComponent from '../components/ModalComponent';

import { TokenContext } from '../store/index';

// api config
// import { apiConfig } from '../config/prod';
const apiConfig = process.env.apiConfig;

const Home: React.FunctionComponent = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter();

  // Validation
  const { StringType, NumberType, DateType } = Schema.Types;

  const model = Schema.Model({
    name: StringType().isRequired('Please enter your name'),
    accountNo: StringType()
      .minLength(10, 'Account number is invalid')
      .isRequired('Please enter your account number'),
    phone: StringType().isRequired('Please enter your phone number'),
    bankId: NumberType().isRequired('Please select a bank'),
    // role: StringType().isRequired('Please select a role'),
    // startDate: DateType().isRequired('Please select a startDate'),
    // endDate: DateType().isRequired('Please select a endDate'),
  });

  // const [banks, setBanks] = useState([]);
  const [name, setName] = useState<string>('');
  const [accountNo, setAccountNo] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bankId, setBankId] = useState<number>(undefined);
  const [requestId, setRequestId] = useState<number>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [isFormValid, setIsFormValid] = useState(false);
  let formValue = {
    name,
    accountNo,
    phone,
    bankId,
  };
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const banks: [] = props.banks.map((bank) => ({
    label: bank.name,
    value: bank.id,
  }));
  // const {banks} = props;
  const role: string = 'Applicant';
  const startDate: string = moment().subtract(3, 'months').format('DD-MM-YYYY');
  const endDate: string = moment().format('DD-MM-YYYY');
  const country: string = 'NG';
  const username: string = 'Info@metromfb.com';
  const destinationId: number = 268;

  // // set is enable form

  const onSubmitForm = async (valid) => {
    if (valid) {
      // build the object to submit the form
      const requestStatementData = {
        accountNo,
        phone,
        bankId,
        destinationId,
        startDate,
        endDate,
        role,
        username,
        country,
        applicants: [{ name }],
      };

      setIsFormSubmitted(true);
      // Make a call to the server https://cors-anywhere.herokuapp.com
      try {
        const res = await fetch(
          '/api/request-statement',
          {
            method: 'POST',
            body: JSON.stringify(requestStatementData),
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
              Accept: '*/*',
              'Access-Control-Allow-Origin': '*', 
              'Client-ID': apiConfig['Client-ID'],
              'Client-Secret': apiConfig['Client-Secret'],
            },
          }
        );

        const response = await res.json();
        if (response && response.status === '00') {
          setIsFormSubmitted(false);
          setShowModal(true);
          setRequestId(response.result);

          // Reset all states
          formValue.name = '';
          formValue.accountNo = '';
          formValue.phone = '';
          formValue.bankId = null;
          setName('');
          setAccountNo('');
          setPhone('');
          setBankId(null);
        }
      } catch (error) {
        Alert.error(
          'Bank Statement Could not be proccessed, please try again',
          3000
        );
        setIsFormSubmitted(false);
      }
    }
  };

  const [tokenState, tokenDispatcher] = useContext(TokenContext);
  useEffect(() => {
    console.log('state', tokenState);
    // Osaz this is just to consolelog the state   tokenDispatcher('SET_TOKEN', token)
  }, [tokenState]);

  return (
    <main>
      <Head>
        <title>Home</title>
      </Head>

      <Container>
        <Header>
          <Navigation />
        </Header>
        <ModalComponent
          showModal={showModal}
          requestId={requestId}
          customer={name}
          setShowModal={setShowModal}
        />
        <div className='container mb-5'>
          <FlexboxGrid justify='center'>
            {/* <FlexboxGrid.Item colspan={6} className='customSideBar'>
            <p>
              <a>MyBankStatement</a>
            </p>
          </FlexboxGrid.Item> */}
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
              <Content>
                <h4 className='px-5 mt-2 text-center'>Identity Verification</h4>
                <hr />

                <Form
                  model={model}
                  fluid
                  onSubmit={onSubmitForm}
                  formValue={formValue}
                >
                  <FormGroup className='w-100'>
                    <ControlLabel>Applicant's Name</ControlLabel>
                    <FormControl
                      name='name'
                      onChange={(value) => {
                        setName(value);
                        tokenDispatcher({
                          type: 'SET_NAME',
                          name: value,
                        });
                      }}
                    />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>Account Number</ControlLabel>
                    <FormControl
                      name='accountNo'
                      onChange={(value) => setAccountNo(value)}
                    />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>
                      Phone Number(The number connected to your bank)
                    </ControlLabel>
                    <FormControl
                      name='phone'
                      onChange={(value) => setPhone(value)}
                    />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>Bank Name</ControlLabel>
                    <FormControl
                      name='bankId'
                      accepter={SelectPicker}
                      placeholder='Select a Bank'
                      block
                      data={banks}
                      onChange={(value) => setBankId(value)}
                    />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup>

                  {/* <FormGroup>
                    <ControlLabel>Role</ControlLabel>
                    <FormControl
                      name='role'
                      accepter={SelectPicker}
                      placeholder='Select Role'
                      block
                      searchable={false}
                      data={roles}
                    />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup> */}

                  {/* <FormGroup>
                    <ControlLabel>Start Date</ControlLabel>
                    <FormControl
                      name='startDate'
                      oneTap
                      block
                      accepter={DatePicker}
                    />
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>End Date</ControlLabel>
                    <FormControl
                      name='endDate'
                      oneTap
                      block
                      accepter={DatePicker}
                    />
                  </FormGroup> */}
                  <FormGroup>
                    <ButtonToolbar>
                      <Button
                        appearance='primary'
                        block
                        type='submit'
                        // disabled={!isFormValid}
                        loading={isFormSubmitted}
                      >
                        Submit
                      </Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </Content>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </Container>

      <style type='text/less' jsx>{``}</style>
    </main>
  );
};

type Bank = {
  id: number;
  name: string;
  sortCode: string;
};

export const getStaticProps: GetStaticProps = async (context) => {
  let banks: Bank[];

  try {
    const res = await fetch(
      'https://mybankstatement.net/TP/api/SelectActiveRequestBanks',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Client-ID': apiConfig['Client-ID'],
          'Client-Secret': apiConfig['Client-Secret'],
        },
      }
    );

    if (res) {
      const resp = await res.json();
      banks = resp.result;
    }
  } catch (error) {
    console.log('There is an error', error);
  }

  return {
    props: {
      banks: banks || [],
    },
  };
};

export default Home;
