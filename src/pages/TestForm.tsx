import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTestStore } from '../store/testStore';
import { testSchema } from '../utils/validationSchemas';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { z } from 'zod';

type TestFormValues = z.infer<typeof testSchema>;

export const TestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { 
    currentTest, 
    isLoading, 
    error, 
    fetchTestById, 
    createTest, 
    updateTest, 
    clearError 
  } = useTestStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      subject: '',
      topics: '',
      duration: 60,
      correctMarks: 4,
      incorrectMarks: -1,
      totalMarks: 100,
      instructions: '',
    },
  });

  // Load test if editing
  useEffect(() => {
    if (isEditMode && id) {
      fetchTestById(id);
    } else {
      reset({
        name: '',
        subject: '',
        topics: '',
        duration: 60,
        correctMarks: 4,
        incorrectMarks: -1,
        totalMarks: 100,
        instructions: '',
      });
    }
  }, [id, isEditMode, fetchTestById, reset]);

  // Set values once test is loaded
  useEffect(() => {
    if (isEditMode && currentTest && currentTest.id === id) {
      setValue('name', currentTest.name);
      setValue('subject', currentTest.subject);
      setValue('topics', currentTest.topics.join(', '));
      setValue('duration', currentTest.duration);
      setValue('correctMarks', currentTest.markingScheme.correct);
      setValue('incorrectMarks', currentTest.markingScheme.incorrect);
      setValue('totalMarks', currentTest.totalMarks);
      setValue('instructions', currentTest.instructions);
    }
  }, [currentTest, isEditMode, id, setValue]);

  // Clean errors
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: TestFormValues) => {
    if (isEditMode && id) {
      const success = await updateTest(id, data);
      if (success) {
        navigate(`/tests/${id}/questions`);
      }
    } else {
      const created = await createTest(data);
      if (created) {
        navigate(`/tests/${created.id}/questions`);
      }
    }
  };

  if (isEditMode && isLoading && !currentTest) {
    return <Loader type="spinner" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-heading font-black text-slate-800">
              {isEditMode ? 'Modify Test Parameters' : 'Create New Evaluation'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure exam parameters and grading structure
            </p>
          </div>
        </div>
      </div>

      {/* Backend error notification */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[32px] border border-slate-150 p-6 md:p-8 space-y-6 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.025)]">
        
        {/* Core Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Test / Exam Name"
              placeholder="e.g. CUET Physics Mock Challenge - 1"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <Input
            label="Subject"
            placeholder="e.g. Physics, Chemistry, Aptitude"
            error={errors.subject?.message}
            {...register('subject')}
          />

          <Input
            label="Topics (Comma Separated)"
            placeholder="e.g. Mechanics, Thermodynamics, Waves"
            error={errors.topics?.message}
            {...register('topics')}
          />
        </div>

        <hr className="border-slate-100" />

        {/* Scheme & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <Input
            label="Duration (Minutes)"
            type="number"
            placeholder="60"
            error={errors.duration?.message}
            {...register('duration', { valueAsNumber: true })}
          />

          <Input
            label="Correct Mark (+)"
            type="number"
            placeholder="4"
            error={errors.correctMarks?.message}
            {...register('correctMarks', { valueAsNumber: true })}
          />

          <Input
            label="Incorrect Penalty (-)"
            type="number"
            placeholder="-1"
            error={errors.incorrectMarks?.message}
            {...register('incorrectMarks', { valueAsNumber: true })}
          />

          <Input
            label="Total Exam Marks"
            type="number"
            placeholder="100"
            error={errors.totalMarks?.message}
            {...register('totalMarks', { valueAsNumber: true })}
          />
        </div>

        <hr className="border-slate-100" />

        {/* Instructions */}
        <Input
          label="Test Instructions & Conditions"
          placeholder="1. Keep quiet.\n2. Read all options carefully before marking..."
          isTextArea
          rows={5}
          error={errors.instructions?.message}
          {...register('instructions')}
        />

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="shadow-lg shadow-primary-600/15"
          >
            <Save size={16} className="mr-2" />
            Save & Continue to Questions
          </Button>
        </div>

      </form>

    </div>
  );
};

export default TestForm;
