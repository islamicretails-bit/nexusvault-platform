// src/components/admin/AIOperationsHub.ts
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_AI_OPERATIONS, GENERATE_AI_CONTENT } from '../lib/graphql';
import { AiOperation, AiContentGenerationInput } from '../types';
import { LoadingIndicator, Button, ProgressBar } from '../components';
import { useToast } from '../hooks';

interface AIOperationsHubProps {
  // Add props if needed
}

const AIOperationsHub: React.FC<AIOperationsHubProps> = () => {
  const [aiOperations, setAiOperations] = useState<AiOperation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<AiOperation | null>(null);
  const [contentGenerationInput, setContentGenerationInput] = useState<AiContentGenerationInput>({
    // Initialize with default values if needed
  });
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data, loading, error } = useQuery(GET_AI_OPERATIONS);
  const [generateAiContent, { loading: isGenerating }] = useMutation(GENERATE_AI_CONTENT);

  const toast = useToast();

  useEffect(() => {
    if (data) {
      setAiOperations(data.aiOperations);
    }
  }, [data]);

  const handleSelectOperation = (operation: AiOperation) => {
    setSelectedOperation(operation);
  };

  const handleGenerateContent = async () => {
    if (selectedOperation) {
      setIsGeneratingContent(true);
      try {
        const response = await generateAiContent({
          variables: {
            input: contentGenerationInput,
          },
        });
        if (response.data) {
          toast.success('Content generated successfully!');
          // Update the progress bar
          setProgress(100);
        } else {
          toast.error('Error generating content');
        }
      } catch (error) {
        toast.error('Error generating content');
      } finally {
        setIsGeneratingContent(false);
      }
    }
  };

  const handleProgressUpdate = (progress: number) => {
    setProgress(progress);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="ai-operations-hub">
      <h2>AI Operations Hub</h2>
      <div className="operations-list">
        {aiOperations.map((operation) => (
          <div key={operation.id} onClick={() => handleSelectOperation(operation)}>
            {operation.name}
          </div>
        ))}
      </div>
      {selectedOperation && (
        <div className="selected-operation">
          <h3>{selectedOperation.name}</h3>
          <div className="content-generation-input">
            {/* Add input fields for content generation input if needed */}
          </div>
          <Button onClick={handleGenerateContent} disabled={isGeneratingContent}>
            Generate Content
          </Button>
          {isGeneratingContent && (
            <ProgressBar progress={progress} onUpdate={handleProgressUpdate} />
          )}
        </div>
      )}
    </div>
  );
};

export default AIOperationsHub;

/* src/components/admin/AIOperationsHub.css */
.ai-operations-hub {
  padding: 20px;
}

.operations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.operations-list div {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.selected-operation {
  margin-top: 20px;
}

.content-generation-input {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.progress-bar-fill {
  height: 10px;
  background-color: #4CAF50;
}

// src/lib/graphql.ts
import { gql } from '@apollo/client';

export const GET_AI_OPERATIONS = gql`
  query GetAiOperations {
    aiOperations {
      id
      name
    }
  }
`;

export const GENERATE_AI_CONTENT = gql`
  mutation GenerateAiContent($input: AiContentGenerationInput!) {
    generateAiContent(input: $input) {
      id
      name
    }
  }
`;

// src/types/index.ts
interface AiOperation {
  id: string;
  name: string;
}

interface AiContentGenerationInput {
  // Add properties if needed
}

// src/hooks/useToast.ts
import { useState, useEffect } from 'react';

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timeoutId = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [toast]);

  return { toast, showToast };
};

export default useToast;