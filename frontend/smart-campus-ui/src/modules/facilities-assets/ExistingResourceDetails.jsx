import React from 'react';
import { useParams } from 'react-router-dom';
import './ExistingResourceDetails.css';
import { useEffect, useState } from 'react';
import { apiFetch, parseJson } from '../../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';

function getImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

const ExistingResourceDetails = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await apiFetch(`/api/resources/${resourceId}`);
        if (!res.ok) throw new Error('Not found');
        const data = await parseJson(res);
        setResource(data);
      } catch {
        setError('Failed to fetch resource details.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [resourceId]);

  if (loading) return <div className="erd-loading">Loading...</div>;
  if (error) return <div className="erd-error">{error}</div>;
  if (!resource) return <div className="erd-error">No resource found.</div>;

  return (
    <div className="erd-container">
      <table className="erd-table">
        <thead>
          <tr>
            <th colSpan="2" className="erd-header">{resource.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="erd-label">ID</td><td>{resource.id}</td></tr>
          <tr><td className="erd-label">Type</td><td>{resource.type}</td></tr>
          <tr><td className="erd-label">Capacity</td><td>{resource.capacity}</td></tr>
          <tr><td className="erd-label">Location</td><td>{resource.location}</td></tr>
          <tr><td className="erd-label">Available From</td><td>{resource.availableFrom}</td></tr>
          <tr><td className="erd-label">Available To</td><td>{resource.availableTo}</td></tr>
          <tr><td className="erd-label">Status</td><td>{resource.status}</td></tr>
          <tr><td className="erd-label">Created At</td><td>{resource.createdAt}</td></tr>
          <tr><td className="erd-label">Updated At</td><td>{resource.updatedAt}</td></tr>
        </tbody>
      </table>
      <div className="erd-image-card">
        <h3>Resource Image</h3>
        {resource.imageUrl ? (
          <img
            className="erd-image"
            src={getImageUrl(resource.imageUrl)}
            alt={`${resource.name} preview`}
          />
        ) : (
          <p className="muted">No image uploaded for this resource.</p>
        )}
      </div>
    </div>
  );
};

export default ExistingResourceDetails;
