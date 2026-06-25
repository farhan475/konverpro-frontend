import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-blue-900 text-white rounded-3xl p-8 mb-8 shadow-xl">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full blur-3xl opacity-10 -ml-24 -mb-24"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
          {description && (
            <p className="text-blue-100/70 text-sm max-w-2xl font-medium">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
