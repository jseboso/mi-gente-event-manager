export const handleApiError = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  };
  
  export const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  };
  
  export const serializeDocument = (doc) => {
    // If it's a Mongoose document, convert to object
    const object = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    
    // Process all fields
    for (const [key, value] of Object.entries(object)) {
      // Convert ObjectIds to strings
      if (value && value.toString && key === '_id') {
        object[key] = value.toString();
      }
      
      // Convert Dates to ISO strings
      else if (value instanceof Date) {
        object[key] = value.toISOString();
      }
      
      // Recursively process nested objects
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        object[key] = serializeDocument(value);
      }
      
      // Recursively process arrays
      else if (Array.isArray(value)) {
        object[key] = value.map(item => 
          item && typeof item === 'object' ? serializeDocument(item) : item
        );
      }
    }
    
    return object;
  };