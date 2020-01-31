import React, { useState } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { reduxForm, Form, Field, FieldArray, InjectedFormProps, arrayPush } from 'redux-form';
import { useSelector } from 'react-redux';
import { compose } from 'recompose';
import { Box } from '@material-ui/core';
import { DispatchProp } from 'react-redux';
import get from 'lodash/get';

import FormWrapper from 'src/components/FormWrapper';
import FormInput from 'src/components/FormInput';
import Button from 'src/components/Button';
import ListModal from 'src/components/ListModal';
import MemberItem from 'src/components/ListModal/MemberItem';
import Container from 'src/components/Container';
import FieldContactCard from 'src/components/FieldContactCard';
import FormTitleWithAdd from 'src/components/FormTitleWithAdd';
import { APIUserExtended } from 'src/models';
import { modifyLocationPromise, getMembersList } from 'src/actions';
import { RootState } from 'src/reducers';
import styles from './styles';

type ParentProps = {
  isEdit: boolean;
};

type Props = WithStyles<typeof styles> & InjectedFormProps<any, ParentProps> & DispatchProp & ParentProps;

const formName = 'modifyLocation';
const selector = (store: RootState) => get(store, `form.${formName}.values.users`, []).map((el: any) => el.id);

const LocationForm = ({ classes, handleSubmit, reset, pristine, dispatch }: Props) => {
  const [isModalShow, toggleModal] = useState(false);
  const addedMembers: string[] = useSelector(selector);

  const addMember = (members: APIUserExtended[]) => {
    members.forEach(el => {
      dispatch(arrayPush(formName, 'users', el));
    });
  };

  const handleToggleModal = () => {
    toggleModal(!isModalShow);
  };

  return (
    <>
      <Form onSubmit={ handleSubmit(modifyLocationPromise) }>
        <div className={ classes.formGroup }>
          <FormWrapper formTitle='Location info'>
            <Field name='name' label='Location name' className='form-row' component={ FormInput } />
            <Field name='address' label='Street address of location' className='form-row' component={ FormInput } />
          </FormWrapper>
        </div>

        <Container>
          <FormTitleWithAdd title='List of members' buttonText='Add member' handleClick={ handleToggleModal } />

          <FieldArray name='users' component={ FieldContactCard } />

          <Box className={ classes.actions }>
            <Button type='reset' onClick={ reset } />
            <Button type='submit' disabled={ pristine } />
          </Box>
        </Container>
      </Form>
      { isModalShow && (
        <ListModal
          branch='members.list'
          title='Add Members'
          existedIDs={ addedMembers }
          didMountAction={ getMembersList }
          handleClose={ handleToggleModal }
          handleAddItems={ addMember }
          component={ MemberItem }
        />
      ) }
    </>
  );
};

export default compose<Props, Partial<Props>>(
  withStyles(styles),
  reduxForm<any, ParentProps>({
    form: formName,
  }),
)(LocationForm);
