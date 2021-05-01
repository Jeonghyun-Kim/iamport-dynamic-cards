import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useUI } from '@components/ui/context';

import Button from '@components/ui/Button';
import Select from '@components/ui/Select';

import fetcher from '@lib/fetcher';

const impCode = process.env.NEXT_PUBLIC_IMP_CODE;
if (!impCode) throw new Error('Missing NEXT_PUBLIC_IMP_CODE');

const cardListOptions = [
  {
    key: 'key1',
    label: '선택',
    value: null,
  },
  {
    key: 'key2',
    label: '모든 카드',
    value: 'all',
  },
  {
    key: 'key3',
    label: 'BC 제외',
    value: 'exceptBC',
  },
  {
    key: 'key4',
    label: 'BC, 국민 제외',
    value: 'exceptBCKB',
  },
];

const IndexPage = () => {
  const { showModal, closeModal } = useUI();
  const [option, setOption] = React.useState<{
    key: string;
    label: string;
    value: string | null;
  }>(cardListOptions[0]);

  const handleRequest = React.useCallback(
    (option: 'all' | 'exceptBC' | 'exceptBCKB') => {
      const IMP = window.IMP;

      const { protocol, hostname, port } = window.location;

      IMP.init(impCode);

      const merchantId = uuidv4();

      const cardOptions: { card_code: string; enabled: boolean }[] = [
        { card_code: '*', enabled: true },
      ];

      switch (option) {
        case 'exceptBC':
          cardOptions.push({ card_code: '361', enabled: false });
          break;
        case 'exceptBCKB':
          cardOptions.push(
            { card_code: '361', enabled: false },
            { card_code: '381', enabled: false },
          );
          break;
      }

      IMP.request_pay(
        {
          pay_method: 'card',
          merchant_uid: merchantId,
          name: '테스트 상품',
          amount: 1000,
          tax_free: 0,
          buyer_name: 'tester',
          buyer_tel: '',
          buyer_email: '',
          m_redirect_url: `${protocol}//${hostname}:${port}/api/complete/mobile`,
          card: { detail: cardOptions },
        },
        (rsp: IMPResult) => {
          if (rsp.success) {
            fetcher('/api/complete/desktop', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
              }),
            })
              .then((response) => {
                console.log(response);
                showModal({
                  variant: 'default',
                  title: 'SUCCESS',
                  content: '자세한 내용은 콘솔을 확인하세요.',
                  actionButton: {
                    label: '확인',
                    onClick: () => closeModal(),
                  },
                  cancelButton: {
                    label: '닫기',
                    onClick: () => closeModal(),
                  },
                });
              })
              .catch((error) => {
                console.error(error);
                showModal({
                  variant: 'alert',
                  title: 'Failed',
                  content: error.message,
                  actionButton: {
                    label: '확인',
                    onClick: () => closeModal(),
                  },
                  cancelButton: {
                    label: '닫기',
                    onClick: () => closeModal(),
                  },
                });
              });
          } else {
            showModal({
              variant: 'alert',
              title: 'Failed',
              content: rsp.error_msg,
              actionButton: {
                label: '확인',
                onClick: () => closeModal(),
              },
              cancelButton: {
                label: '닫기',
                onClick: () => closeModal(),
              },
            });
          }
        },
      );
    },
    [showModal, closeModal],
  );

  return (
    <>
      <div className="mx-auto max-w-screen-lg text-2xl pt-4 h-[1200px] flex justify-center">
        {/* <p className="text-xl">hello world</p> */}
        <div className="space-y-4">
          <div className="w-64">
            <Select
              label="카드사 목록"
              items={cardListOptions}
              selectedValue={option.value}
              onSelect={(item) => setOption(item as never)}
            />
          </div>
          <Button
            className="float-right"
            onClick={() => {
              if (!option.value) return;
              handleRequest(option.value as never);
            }}
            disabled={!option.value}
          >
            결제
          </Button>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
