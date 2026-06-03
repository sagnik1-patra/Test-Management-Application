import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Clock, Award, FileText, CheckCircle, Info
} from 'lucide-react';
import { useTestStore } from '../store/testStore';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

export const PreviewPublish: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentTest,
    questions,
    isLoading,
    error,
    fetchTestById,
    fetchQuestions,
    publishTest,
    clearError
  } = useTestStore();

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (testId) {
      fetchTestById(testId);
      fetchQuestions(testId);
    }
  }, [testId, fetchTestById, fetchQuestions]);

  // Clean errors
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handlePublishClick = () => {
    setPublishModalOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!testId) return;
    setIsPublishing(true);
    const success = await publishTest(testId);
    setIsPublishing(false);
    setPublishModalOpen(false);
    if (success) {
      setSuccessModalOpen(true);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (isLoading && !currentTest) {
    return <Loader type="spinner" />;
  }

  const isPublished = currentTest?.status === 'published';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/tests/${testId}/questions`)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Back to Questions"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-heading font-black text-slate-800">
              Preview & Review
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Perform final configurations and validation check before publishing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          {isPublished ? (
            <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold uppercase tracking-wider">
              <CheckCircle size={14} />
              Published
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublishClick}
              disabled={questions.length === 0}
              className="shadow-lg shadow-primary-600/15"
            >
              Publish Test
            </Button>
          )}
        </div>
      </div>

      {/* Backend errors */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold">
          {error}
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Test Summary Panel (1 column) */}
        <div className="md:col-span-1 space-y-5">
          
          {/* Exam Details Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 select-none">
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider">
              Test Summary
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <h4 className="text-sm font-heading font-extrabold text-slate-800 leading-snug">
                  {currentTest?.name}
                </h4>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-600 text-3xs font-bold uppercase rounded">
                  {currentTest?.subject}
                </span>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="space-y-1">
                  <span className="text-3xs text-slate-400 uppercase">Duration</span>
                  <div className="flex items-center gap-1 text-slate-800">
                    <Clock size={12} className="text-slate-400" />
                    <span>{currentTest?.duration} Min</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xs text-slate-400 uppercase">Total Marks</span>
                  <div className="flex items-center gap-1 text-slate-800">
                    <Award size={12} className="text-slate-400" />
                    <span>{currentTest?.totalMarks} Pts</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xs text-slate-400 uppercase">Questions</span>
                  <div className="flex items-center gap-1 text-slate-800">
                    <FileText size={12} className="text-slate-400" />
                    <span>{questions.length} Items</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xs text-slate-400 uppercase">Status</span>
                  <div className={`capitalize font-bold text-xxs ${isPublished ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {currentTest?.status}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Marking Scheme parameters */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xxs font-semibold text-slate-600">
                <p className="text-3xs text-slate-400 uppercase tracking-wider mb-1">Marking Parameters</p>
                <div className="flex justify-between">
                  <span>Correct Answer:</span>
                  <span className="text-emerald-600">+{currentTest?.markingScheme.correct} Marks</span>
                </div>
                <div className="flex justify-between">
                  <span>Incorrect Penalty:</span>
                  <span className="text-rose-500">{currentTest?.markingScheme.incorrect} Marks</span>
                </div>
              </div>

            </div>
          </div>

          {/* Test Instructions Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 select-none">
            <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Info size={13} />
              Candidate Instructions
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
              {currentTest?.instructions || 'No instructions specified.'}
            </p>
          </div>

        </div>

        {/* Questions Preview List (2 columns) */}
        <div className="md:col-span-2 space-y-5">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-heading font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between select-none">
              <span>Exam Question Sheet</span>
              <span className="text-xxs font-medium text-slate-400">Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)} Pts</span>
            </h3>

            {questions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 select-none">
                No questions added to this test yet. Click "Back" to add questions.
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div key={q.id} className="space-y-3 text-left">
                    {/* Question text */}
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {qIndex + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-8">
                      {q.options.map((option, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div 
                            key={optIdx}
                            className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all select-none ${
                              isCorrect 
                                ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800' 
                                : 'bg-slate-50/40 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-3xs font-bold ${
                                isCorrect 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'bg-slate-200 text-slate-500'
                              }`}>
                                {optionLetters[optIdx]}
                              </span>
                              <span>{option}</span>
                            </span>

                            {isCorrect && (
                              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Marking indicators */}
                    <div className="pl-8 flex items-center gap-4 text-3xs font-bold text-slate-400 select-none">
                      <span>Value: {q.marks} Pts</span>
                      {q.negativeMarks > 0 && (
                        <span className="text-rose-400">Penalty: -{q.negativeMarks} Pts</span>
                      )}
                    </div>

                    {qIndex < questions.length - 1 && (
                      <hr className="border-slate-100/60 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Publish Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        title="Publish Evaluation Test"
        confirmText="Publish Live"
        confirmVariant="primary"
        isLoading={isPublishing}
      >
        Are you sure you want to publish <strong className="text-slate-800">{currentTest?.name}</strong>? 
        Once published, the test configuration and questions will be locked, and candidate access keys will be generated.
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/dashboard');
        }}
        title="Test Published Successfully!"
        confirmText="Back to Dashboard"
        onConfirm={() => {
          setSuccessModalOpen(false);
          navigate('/dashboard');
        }}
      >
        <div className="flex flex-col items-center py-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-800 text-center">
            "{currentTest?.name}" has been published.
          </p>
          <p className="text-xs text-slate-500 text-center">
            Candidates can now take this assessment under the configured parameters.
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default PreviewPublish;
