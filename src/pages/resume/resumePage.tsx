'use client';
import { useState } from 'react';
import { Resume, ResumeList } from '@/widgets/resume';

export function ResumePage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingResumeId, setEditingResumeId] = useState<number | undefined>(
    undefined,
  );

  const handleCreateNew = () => {
    setEditingResumeId(undefined);
    setView('create');
  };

  const handleEdit = (resumeId: number) => {
    setEditingResumeId(resumeId);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingResumeId(undefined);
  };

  if (view === 'list') {
    return <ResumeList onCreateNew={handleCreateNew} onEdit={handleEdit} />;
  }

  return <Resume id={editingResumeId} />;
}
