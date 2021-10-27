import { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { Modal, Button, Alert } from 'rsuite';

// import { apiConfig } from '../config/prod';
const apiConfig = process.env.apiConfig;
type ModalProps = {
  showModal: boolean;
  requestId: number;
  customer: string;
  setShowModal: Function;
};

const ModalComponent: React.FunctionComponent<ModalProps> = (
  props: ModalProps
) => {
  const router: NextRouter = useRouter();
  const { showModal, requestId, setShowModal } = props;
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  //   const [hideModal, setHideModal] = useState<boolean>(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const processRequestStatement = async () => {
    // Set Loading indicator
    setIsFormSubmitted(true);

    // Make a call to the serverhttps://cors-anywhere.herokuapp.com
    try {
      const res = await fetch(
        '/api/get-request-feedback',
        {
          method: 'POST',
          body: JSON.stringify({ requestId }),
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
        closeModal();
        router.push({pathname: '/statement/confirm', query: response && response.result});
        Alert.info('An sms has been sent your phone', 5000);
      } else if (response.status == '99') {
        setIsFormSubmitted(false);
        Alert.error(response.message);
      }
    } catch (error) {
      Alert.error(
        'Bank Statement Could not be proccessed, please try again',
        3000
      );
    }
  };

  return (
    <Modal size='xs' show={showModal}>
      <Modal.Header>
        <Modal.Title>Verification of account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Please note that as part of our verification process, we will confirm
          your eligibility using your bank statement.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={processRequestStatement}
          appearance='primary'
          loading={isFormSubmitted}
        >
          Proceed
        </Button>
        <Button onClick={closeModal} appearance='default'>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
