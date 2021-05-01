/* eslint-disable @typescript-eslint/no-explicit-any */
import '@assets/main.css';
import 'nprogress/nprogress.css';

import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';

import ManagedUIContext from '@components/ui/context';
import Layout from '@components/ui/Layout';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="/js/redirectIE.js" />
        <script
          type="text/javascript"
          src="https://code.jquery.com/jquery-1.12.4.min.js"
        />
        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js"
        />
        <title>아임포트 카드사 제외 테스트 | ONDP</title>
      </Head>
      <DefaultSeo
        titleTemplate="%s | ONDP"
        defaultTitle="아임포트 카드사 제외 테스트 | ONDP"
        openGraph={{
          type: 'website',
          title: '아임포트 카드사 제외 테스트 | ONDP',
          description: '금액별 노출 제외 카드사를 위한 테스트',
          images: [
            {
              url: 'https://iamport.vercel.app/open_graph.jpg',
              width: 1200,
              height: 628,
              alt: 'COLLECTED',
            },
          ],
        }}
        defaultOpenGraphImageWidth={1200}
        defaultOpenGraphImageHeight={628}
      />
      <ManagedUIContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  );
};

export default App;
