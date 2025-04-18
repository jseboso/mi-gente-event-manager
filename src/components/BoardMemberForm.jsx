import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function BoardMemberForm({ defaultValues, isEditing = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(defaultValues?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      ...defaultValues,
    },
  });
  
  // Watch the imageUrl field to update the preview
  const imageUrl = watch('imageUrl');
  
  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Create a preview URL
    setPreviewImage(URL.createObjectURL(file));
    
    try {
      setUploading(true);
      
      // Create a form data object
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload the image
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }
      
      // Set the imageUrl field with the URL returned from the server
      setValue('imageUrl', result.imageUrl);
      setUploading(false);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image: ' + err.message);
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const endpoint = isEditing 
        ? `/api/board-members/${defaultValues._id}`
        : '/api/board-members';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        let errorMsg = result.message || 'Failed to save board member';
        if (result.debug) {
          console.error('Debug info:', result.debug);
          errorMsg += ' - Check console for debug info';
        }
        throw new Error(errorMsg);
      }
      
      // Redirect to board members page
      router.push('/board');
      
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Board Member' : 'Add New Board Member'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter board member's name"
            {...register('name', { 
              required: 'Name is required',
              maxLength: {
                value: 100,
                message: 'Name must be less than 100 characters'
              }
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="position" className="block text-gray-700 mb-1 font-medium">
            Position
          </label>
          <input
            id="position"
            type="text"
            className={`w-full p-2 border rounded ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter board position"
            {...register('position', { 
              required: 'Position is required',
              maxLength: {
                value: 100,
                message: 'Position must be less than 100 characters'
              }
            })}
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-gray-700 mb-1 font-medium">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="A short bio for this board member"
            {...register('bio')}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="order" className="block text-gray-700 mb-1 font-medium">
            Display Order
          </label>
          <input
            id="order"
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="0"
            {...register('order', { 
              valueAsNumber: true
            })}
          />
          <p className="text-gray-500 text-sm mt-1">
            Lower numbers display first (e.g., President might be 1)
          </p>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Profile Photo
          </label>
          
          {(previewImage || imageUrl) && (
            <div className="mb-3">
              <div className="relative h-40 w-40 mx-auto overflow-hidden rounded-full border-2 border-yellow-600">
                <Image
                  src={previewImage || imageUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="mt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:bg-blue-300"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            
            <input
              type="hidden"
              {...register('imageUrl')}
            />
            
            <p className="text-gray-500 text-sm mt-1">
              Upload a headshot photo (square photos work best)
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium disabled:bg-yellow-400"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Board Member'}
          </button>
        </div>
      </form>
    </div>
  );
}