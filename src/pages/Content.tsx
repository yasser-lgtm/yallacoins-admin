import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, AlertCircle } from 'lucide-react';

interface ContentBlock {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext';
  value: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Mock content blocks - API endpoint not yet implemented
// In production, these would be fetched from: GET /api/content/blocks
const mockContentBlocks: ContentBlock[] = [
  {
    id: 'hero-title',
    key: 'hero.title',
    label: 'Hero Section Title',
    type: 'text',
    value: 'Convert Your Earnings to Real Money',
    updatedBy: 'System',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hero-subtitle',
    key: 'hero.subtitle',
    label: 'Hero Section Subtitle',
    type: 'textarea',
    value: 'Fast, secure withdrawals from your favorite streaming apps',
    updatedBy: 'System',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-title',
    key: 'faq.title',
    label: 'FAQ Section Title',
    type: 'text',
    value: 'Frequently Asked Questions',
    updatedBy: 'System',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'support-message',
    key: 'support.message',
    label: 'Support Message',
    type: 'textarea',
    value: 'Have questions? Contact our support team via WhatsApp for instant assistance.',
    updatedBy: 'System',
    updatedAt: new Date().toISOString(),
  },
];

export const Content: React.FC = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(mockContentBlocks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ContentBlock>>({});
  const [isMockMode, setIsMockMode] = useState(true);

  useEffect(() => {
    // TODO: When backend content API is ready, uncomment the following:
    // fetchContentBlocks();
    console.log('[CONTENT] Using mock data - API endpoint not yet implemented');
  }, []);

  // TODO: Implement this when backend API is ready
  // const fetchContentBlocks = async () => {
  //   try {
  //     const response = await fetch('/api/content/blocks', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setBlocks(data);
  //     setIsMockMode(false);
  //   } catch (error) {
  //     console.error('Failed to fetch content blocks:', error);
  //     setIsMockMode(true);
  //   }
  // };

  const handleEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditValues(block);
  };

  const handleSave = () => {
    if (editingId) {
      // TODO: When backend API is ready, call:
      // await updateContentBlock(editingId, editValues);
      setBlocks(blocks.map(b => b.id === editingId ? { ...b, ...editValues, updatedAt: new Date().toISOString() } : b));
      setEditingId(null);
      setEditValues({});
      console.log('[CONTENT] Content block updated (local state only)');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const ContentBlockCard = ({ block }: { block: ContentBlock }) => {
    const isEditing = editingId === block.id;

    return (
      <div className="card-admin">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{block.label}</h3>
            <p className="text-sm text-gray-600 font-mono">{block.key}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => handleEdit(block)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isMockMode}
              title={isMockMode ? 'Editing disabled - API not yet implemented' : 'Edit content'}
            >
              <Edit2 size={16} className={isMockMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {block.type === 'textarea' || block.type === 'richtext' ? (
              <textarea
                value={editValues.value || ''}
                onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
                className="textarea-admin h-32"
              />
            ) : (
              <input
                type="text"
                value={editValues.value || ''}
                onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
                className="input-admin"
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 btn-admin-primary btn-admin-sm flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 btn-admin-secondary btn-admin-sm flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">{block.value}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>Updated by {block.updatedBy}</span>
              <span>{new Date(block.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Website Content Control</h2>
        <p className="text-gray-600 mt-1">Update website content without code changes</p>
      </div>

      {/* Status Alert */}
      {isMockMode && (
        <div className="card-admin mb-6 bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>API-Ready Placeholder:</strong> This page is using mock data. The backend content API endpoint is not yet implemented.
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              When ready, implement: <code className="bg-yellow-100 px-1 rounded">GET/POST /api/content/blocks</code>
            </p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="card-admin mb-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Changes to content blocks will be reflected on the public website immediately once the backend API is implemented.
        </p>
      </div>

      {/* Content Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blocks.map(block => (
          <ContentBlockCard key={block.id} block={block} />
        ))}
      </div>

      {/* Implementation Guide */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">Backend Implementation Guide</h3>
        <div className="space-y-2 text-sm text-gray-700 font-mono">
          <p>Required endpoints:</p>
          <p className="ml-4">• GET /api/content/blocks - Fetch all content blocks</p>
          <p className="ml-4">• POST /api/content/blocks/:id - Update a content block</p>
          <p className="ml-4">• DELETE /api/content/blocks/:id - Delete a content block</p>
          <p className="mt-3">Response format:</p>
          <pre className="ml-4 bg-white p-2 rounded border border-gray-300 overflow-auto text-xs">
{`{
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext';
  value: string;
  updatedBy: string;
  updatedAt: string;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
