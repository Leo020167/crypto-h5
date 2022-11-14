import { Input } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { useState } from 'react';
import styled from 'styled-components';

interface PasswordProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
}
const Password = ({ value, onChange, ...rest }: PasswordProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <Input
        {...rest}
        className="input"
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
      />
      <div className="eye">
        {!visible ? (
          <EyeInvisibleOutline onClick={() => setVisible(true)} />
        ) : (
          <EyeOutline onClick={() => setVisible(false)} />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-right: 1rem;

  .input {
    flex: auto;
  }

  .eye {
    flex: none;
    margin-left: 8px;
    padding: 4px;
    cursor: pointer;
    svg {
      display: block;
      font-size: var(--adm-font-size-7);
    }
  }
`;

export default Password;
