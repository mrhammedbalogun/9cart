import { AppProps } from 'next/app';
import '../public/styles/app.less';
// import 'rsuite/lib/styles/themes/dark/index.less';
import '../public/styles/custom-theme.less';
import { TokenProvider } from '../store';

const MyApp: React.FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  return (<TokenProvider> <Component {...pageProps} /> </TokenProvider> );
};

export default MyApp;
