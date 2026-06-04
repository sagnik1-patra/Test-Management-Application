import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Plus, Edit, Trash2, 
  HelpCircle, Sparkles 
} from 'lucide-react';
import { useTestStore } from '../store/testStore';
import { questionSchema } from '../utils/validationSchemas';
import type { Question } from '../types/question.types';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { z } from 'zod';

type QuestionFormValues = z.infer<typeof questionSchema>;

export const Questions: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentTest,
    questions,
    isLoading,
    error,
    fetchTestById,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    clearError
  } = useTestStore();

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: 0,
      marks: 4,
      negativeMarks: 1,
    },
  });

  // Load test config and questions on mount
  useEffect(() => {
    if (testId) {
      fetchTestById(testId);
      fetchQuestions(testId);
    }
  }, [testId, fetchTestById, fetchQuestions]);

  // Autofill marks from test marking scheme when loaded
  useEffect(() => {
    if (currentTest && !editingQuestion) {
      reset({
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: 0,
        marks: currentTest.markingScheme.correct || 4,
        negativeMarks: Math.abs(currentTest.markingScheme.incorrect) || 0,
      });
    }
  }, [currentTest, editingQuestion, reset]);

  // Clean errors
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: QuestionFormValues) => {
    if (!testId) return;

    let success = false;
    if (editingQuestion) {
      success = await updateQuestion(editingQuestion.id, data);
      if (success) {
        setEditingQuestion(null);
      }
    } else {
      success = await createQuestion(testId, data);
    }

    if (success) {
      // Reset form to defaults
      reset({
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: 0,
        marks: currentTest?.markingScheme.correct || 4,
        negativeMarks: Math.abs(currentTest?.markingScheme.incorrect || 0),
      });
    }
  };

  const handleEditClick = (q: Question) => {
    setEditingQuestion(q);
    setValue('questionText', q.questionText);
    setValue('option1', q.options[0] || '');
    setValue('option2', q.options[1] || '');
    setValue('option3', q.options[2] || '');
    setValue('option4', q.options[3] || '');
    setValue('correctAnswer', q.correctAnswer);
    setValue('marks', q.marks);
    setValue('negativeMarks', q.negativeMarks);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    reset({
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: 0,
      marks: currentTest?.markingScheme.correct || 4,
      negativeMarks: Math.abs(currentTest?.markingScheme.incorrect || 0),
    });
  };

  const handleDeleteClick = (q: Question) => {
    setQuestionToDelete(q);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    await deleteQuestion(questionToDelete.id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  if (isLoading && !currentTest) {
    return <Loader type="spinner" />;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-heading font-black text-slate-800">
              Build MCQ Question Bank
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Adding questions to: <strong className="text-slate-700">{currentTest?.name}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/tests/${testId}/preview`)}
        >
          Preview & Publish
          <ArrowRight size={14} className="ml-1.5" />
        </Button>
      </div>

      {/* Backend errors */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold">
          {error}
        </div>
      )}

      {/* Interactive Two-Column Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Question List (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-[28px] border border-slate-150 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-heading font-bold text-slate-800 mb-4 flex items-center justify-between select-none">
              <span>Current Questions ({questions.length})</span>
              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-3xs font-extrabold rounded-full">
                Test Total: {questions.reduce((sum, q) => sum + q.marks, 0)} Pts
              </span>
            </h3>

            {questions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
                <HelpCircle size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">No Questions Added Yet</p>
                <p className="text-3xs text-slate-400 mt-1">Use the builder form on the right to add MCQs.</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative ${
                      editingQuestion?.id === q.id 
                        ? 'border-primary-400 bg-primary-50/20 shadow-sm shadow-primary-600/5'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-3xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                        {q.questionText}
                      </p>
                      <div className="flex gap-3 text-3xs text-slate-400 font-medium mt-1.5">
                        <span className="text-emerald-600 font-semibold">Correct: Option {q.correctAnswer + 1}</span>
                        <span>•</span>
                        <span>{q.marks} Marks</span>
                        {q.negativeMarks > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-rose-500">-{q.negativeMarks} Penalty</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <button
                        onClick={() => handleEditClick(q)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-xs transition-all"
                        title="Edit Question"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(q)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-md shadow-xs transition-all"
                        title="Delete Question"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Builder Form (7 columns) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-150 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.025)] space-y-5">
            <div className="flex items-center justify-between select-none">
              <h3 className="text-base font-heading font-black text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-primary-500" />
                {editingQuestion ? `Modify Question` : 'Add MCQ Question'}
              </h3>
              {editingQuestion && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Question Text */}
              <Input
                label="Question Text"
                placeholder="Type the question content here..."
                isTextArea
                rows={3}
                error={errors.questionText?.message}
                {...register('questionText')}
              />

              {/* Options */}
              <div className="space-y-3.5">
                <h4 className="text-xxs font-heading font-bold text-slate-400 uppercase tracking-wider select-none">
                  Answer Options
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Option 1"
                    placeholder="Enter choice 1"
                    error={errors.option1?.message}
                    {...register('option1')}
                  />
                  <Input
                    label="Option 2"
                    placeholder="Enter choice 2"
                    error={errors.option2?.message}
                    {...register('option2')}
                  />
                  <Input
                    label="Option 3"
                    placeholder="Enter choice 3"
                    error={errors.option3?.message}
                    {...register('option3')}
                  />
                  <Input
                    label="Option 4"
                    placeholder="Enter choice 4"
                    error={errors.option4?.message}
                    {...register('option4')}
                  />
                </div>
              </div>

              {/* Correct Answer & Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* Correct Option Dropdown */}
                <div className="text-left">
                  <label className="block text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Correct Option
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200"
                    {...register('correctAnswer', { valueAsNumber: true })}
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>

                <Input
                  label="Marks (+)"
                  type="number"
                  placeholder="4"
                  error={errors.marks?.message}
                  {...register('marks', { valueAsNumber: true })}
                />

                <Input
                  label="Negative Marks (-)"
                  type="number"
                  placeholder="1"
                  error={errors.negativeMarks?.message}
                  {...register('negativeMarks', { valueAsNumber: true })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {editingQuestion && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Discard Changes
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="shadow-lg shadow-primary-600/15"
                >
                  <Plus size={16} className="mr-1.5" />
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </Button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-3xl shadow-xs select-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/tests/edit/${testId}`)}
        >
          <ArrowLeft size={14} className="mr-1.5" />
          Back to Test Parameters
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/tests/${testId}/preview`)}
          className="shadow-lg shadow-primary-600/15"
          disabled={questions.length === 0}
        >
          Preview & Publish Test
          <ArrowRight size={14} className="ml-1.5" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete MCQ Question"
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        Are you sure you want to delete this question? This will permanently remove the question item.
      </Modal>

    </div>
  );
};

export default Questions;
