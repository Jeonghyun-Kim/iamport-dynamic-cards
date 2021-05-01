// Declarations for global interfaces & types

interface IMPParams {
  pay_method?: 'card' | 'vbank';
  pg?: string;
  escrow?: boolean;
  merchant_uid: string;
  name: string;
  amount: number;
  custom_data?: { [key: string]: string };
  tax_free?: number;
  buyer_name: string;
  buyer_tel: string;
  buyer_email?: string;
  notice_url?: string;
  vbank_due?: string;
  m_redirect_url?: string;
  card?: {
    detail: { card_code: string; enabled: boolean }[];
  };
}

interface IMPResult {
  success: boolean;
  error_code: string;
  error_msg: string;
  imp_uid: string;
  merchant_uid: string;
  pay_method: string;
  paid_amount: number;
  status: string;
  name: string;
  pg_provider: string;
  pg_tid: string;
  buyer_name: string;
  buyer_email: string;
  buyer_tel: string;
  buyer_addr: string;
  buyer_postcode: string;
  custom_data: unknown;
  paid_at: number;
  receipt_url: string;
  apply_num: string;
  vbank_num: string;
  vbank_name: string;
  vbank_holder: string;
  vbank_date: number;
}

interface IMP {
  init: (id: string) => void;
  request_pay: (param: IMPParams, callback: (rsp: IMPResponse) => void) => void;
}

interface Window {
  IMP: IMP;
}
