import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUserProfile } from '../features/trending/authSlice';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditProfileModal = ({ visible, onClose, onSuccess }) => {
  
    const dispatch = useDispatch();
  
    const user = useSelector((state) => state.auth.user);

  if (!visible) return null;

  const initialValues = {

    name: user?.name || '',
  };

  const validationSchema = Yup.object({
   
    name: Yup.string().required('Name is required'),
  
});

  const handleSubmit = async (values, { setSubmitting }) => {
    
    try {

      await dispatch(editUserProfile(values)).unwrap();
      toast.success('Profile updated successfully!');
      if (onSuccess) onSuccess();
    
    } catch (error) {
      toast.error('Failed to update profile.');
    
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-xl font-semibold">&times;</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onClose} className='bg-red-600 text-white ml-3 border px-4 py-2 rounded'>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal;
