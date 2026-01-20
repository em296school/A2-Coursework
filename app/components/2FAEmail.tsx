interface EmailTemplateProps {
  code: string;
}

export function OTPEmail({ code }: EmailTemplateProps) {
  return (
    <div>
      <h1>{code}</h1>
    </div>
  );
}
