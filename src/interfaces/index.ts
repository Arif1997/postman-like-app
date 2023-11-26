export interface Header {
    key: string;
    value: string;
    description: string;
};

export interface Request  { name: string; type: string; url: string; header: Header[]; body: string };