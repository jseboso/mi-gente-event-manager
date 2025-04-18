import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function EventForm({ defaultValues, isEditing = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(defaultValues?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  let formattedDate = '';
  if (defaultValues?.date) {
    const date = new Date(defaultValues.date);
    formattedDate = date.toISOString().split('T')[0];
  }

  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      ...defaultValues,
      date: formattedDate,
    },
  });
  
  // Watch the imageUrl field to update the preview
  const imageUrl = watch('imageUrl');
  
  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
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
        ? `/api/events/${defaultValues._id}`
        : '/api/events';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log('Submitting to:', endpoint);
      console.log('Method:', method);
      console.log('Data:', data);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (!response.ok) {
        let errorMsg = result.message || 'Failed to save event';
        if (result.debug) {
          console.error('Debug info:', result.debug);
          errorMsg += ' - Check console for debug info';
        }
        throw new Error(errorMsg);
      }
      
      // Redirect to event list or to the created/updated event
      router.push(isEditing ? `/events/${defaultValues._id}` : '/admin/dashboard');
      
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
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-1 font-medium">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter event title"
            {...register('title', { 
              required: 'Title is required',
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters'
              }
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe the event..."
            {...register('description', { required: 'Description is required' })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 mb-1 font-medium">
              Date
            </label>
            <input
              id="date"
              type="date"
              className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="time" className="block text-gray-700 mb-1 font-medium">
              Time
            </label>
            <input
              id="time"
              type="text"
              className={`w-full p-2 border rounded ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 6:00 PM - 8:00 PM"
              {...register('time', { required: 'Time is required' })}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-gray-700 mb-1 font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Event location"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="link" className="block text-gray-700 mb-1 font-medium">
            Event Link (optional)
          </label>
          <input
            id="link"
            type="url"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://example.com/event-registration"
            {...register('link')}
          />
          <p className="text-gray-500 text-sm mt-1">
            Add a link for more information or registration
          </p>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Event Image
          </label>
          
          {/* Image preview */}
          {(previewImage || imageUrl) && (
            <div className="mb-3">
              <div className="relative h-48 w-full overflow-hidden rounded border border-gray-300">
                <Image
                  src={previewImage || imageUrl}
                  alt="Event preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          {/* File input */}
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
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            
            <input
              type="hidden"
              {...register('imageUrl')}
            />
            
            <p className="text-gray-500 text-sm mt-1">
              Upload an image for the event (JPEG or PNG, will be resized and compressed)
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}