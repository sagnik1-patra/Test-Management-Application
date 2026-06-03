import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Clock, Calendar, 
  Settings, Eye, Trash2, Edit, CheckCircle, 
  HelpCircle, ChevronRight, AlertCircle, FileText
} from 'lucide-react';
import { useTestStore } from '../store/testStore';
import type { Test } from '../types/test.types';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tests, isLoading, error, fetchTests, deleteTest, setCurrentTest, clearError } = useTestStore();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Clean errors on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleDeleteClick = (test: Test, e: React.MouseEvent) => {
    e.stopPropagation();
    setTestToDelete(test);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!testToDelete) return;
    setIsDeleting(true);
    const success = await deleteTest(testToDelete.id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setTestToDelete(null);
    if (success) {
      // Re-fetch list
      fetchTests();
    }
  };

  const handleEditClick = (test: Test, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTest(test);
    navigate(`/tests/edit/${test.id}`);
  };

  const handlePreviewClick = (test: Test, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTest(test);
    navigate(`/tests/${test.id}/preview`);
  };

  const handleAddQuestionsClick = (test: Test, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTest(test);
    navigate(`/tests/${test.id}/questions`);
  };

  // Metrics calculation
  const totalTests = tests.length;
  const publishedTests = tests.filter(t => t.status === 'published').length;
  const draftTests = tests.filter(t => t.status === 'draft').length;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-slate-800 tracking-tight">
            Test Repository Dashboard
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor, edit, and publish your mock tests and MCQs.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => {
            setCurrentTest(null);
            navigate('/tests/create');
          }}
          className="shadow-lg shadow-primary-600/15"
        >
          <PlusCircle size={16} className="mr-2" />
          Create Test
        </Button>
      </div>

      {/* Error notification if API is offline */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-semibold flex items-center gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Total Tests</span>
            <p className="text-3xl font-black text-slate-800 font-heading">{totalTests}</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Published</span>
            <p className="text-3xl font-black text-emerald-600 font-heading">{publishedTests}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">Drafts</span>
            <p className="text-3xl font-black text-primary-600 font-heading">{draftTests}</p>
          </div>
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* Tests Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8">
            <Loader type="table" count={4} />
          </div>
        ) : tests.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
              <FileText size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-heading font-bold text-slate-800">
                No Tests Available
              </h3>
              <p className="text-xs text-slate-500">
                Begin by creating a test, adding MCQs, and publishing it.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/tests/create')}>
              <PlusCircle size={14} className="mr-1.5" />
              Create First Test
            </Button>
          </div>
        ) : (
          /* Responsive Table / Card Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xxs font-heading font-bold text-slate-400 uppercase tracking-wider select-none">
                  <th className="px-6 py-4">Test Description</th>
                  <th className="px-6 py-4">Subject & Topics</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => (
                  <tr 
                    key={test.id} 
                    className="hover:bg-slate-50/40 transition-colors cursor-pointer group"
                    onClick={(e) => handlePreviewClick(test, e)}
                  >
                    {/* Test Info */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-heading font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors">
                        {test.name}
                      </div>
                      <div className="flex items-center gap-4 text-xxs text-slate-400 font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {test.duration} Min
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle size={11} />
                          {test.markingScheme.correct} / {test.markingScheme.incorrect} Marks
                        </span>
                      </div>
                    </td>

                    {/* Subject & Topics */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xxs font-semibold rounded-lg">
                        {test.subject}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1.5 max-w-sm">
                        {test.topics.slice(0, 3).map((topic, index) => (
                          <span 
                            key={index} 
                            className="px-1.5 py-0.5 border border-slate-100 bg-white text-slate-400 text-3xs font-medium rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {test.topics.length > 3 && (
                          <span className="text-3xs text-slate-400 font-medium self-center pl-1">
                            +{test.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider ${
                        test.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {test.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xxs text-slate-400 font-medium font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleAddQuestionsClick(test, e)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Add / Manage MCQs"
                        >
                          <PlusCircle size={15} />
                        </button>
                        <button
                          onClick={(e) => handlePreviewClick(test, e)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                          title="Preview Test"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={(e) => handleEditClick(test, e)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(test, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 size={15} />
                        </button>
                        <ChevronRight size={16} className="text-slate-300 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Test Deletion"
        confirmText="Delete Test"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        Are you sure you want to delete <strong className="text-slate-800">{testToDelete?.name}</strong>? 
        This action will permanently delete the test configuration along with all associated MCQ questions. This cannot be undone.
      </Modal>
      
    </div>
  );
};

export default Dashboard;
