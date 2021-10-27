import { Navbar, Nav } from 'rsuite';
import Link from 'next/link';

const Navigation: React.FunctionComponent = () => (
  <Navbar appearance='inverse'>
    <div className='container d-flex align-items-center'>
      <Navbar.Header>
        <Link href='/'>
          <a className='navbar-brand logo mt-2'>9cart</a>
        </Link>
      </Navbar.Header>
      <Navbar.Body>
        <Link href='/statement/confirm'>
          <Nav.Item classPrefix='navbar' className='my-auto'>
            Confirm Statement
          </Nav.Item>
        </Link>
      </Navbar.Body>
    </div>
  </Navbar>
);

export default Navigation;
