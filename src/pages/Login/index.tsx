import { useState } from 'react';
import SwipeImageValidator from '../../components/SwipeImageValidator';

const Login = () => {
  const [valid, setValid] = useState(true);
  return (
    <div>
      <SwipeImageValidator
        title="拖动图片完成验证"
        open={valid}
        onClose={() => setValid(false)}
        onSuccess={() => {
          setValid(false);
        }}
      />
    </div>
  );
};

export default Login;
