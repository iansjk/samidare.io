import React, { useCallback, useState } from "react";
import { TextFieldProps } from "@material-ui/core/TextField";
import { TextField } from "@material-ui/core";

interface Props {
  validator: (newValue: string) => boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const ValidatedTextField: React.FC<Props & TextFieldProps> = (props) => {
  const [isValid, setIsValid] = useState(true);
  const { validator, onChange, value, error, ...rest } = props;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const valid = validator(e.target.value);
      setIsValid(valid);
      if (valid) {
        onChange(e);
      }
    },
    [onChange, validator]
  );

  return <TextField onChange={handleChange} error={!isValid} {...rest} />;
};
export default ValidatedTextField;
