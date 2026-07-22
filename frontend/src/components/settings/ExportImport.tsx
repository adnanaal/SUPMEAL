'use client';

import { useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { exportService } from '../../services/exportService';

export default function ExportImport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportService.exportUserData();
      setImportMessage({ type: 'success', text: 'Export réussi ! Votre fichier a été téléchargé.' });
    } catch (error) {
      setImportMessage({ type: 'error', text: 'Erreur lors de l\'export. Veuillez réessayer.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportMessage(null);
    
    try {
      await exportService.importUserData(importFile);
      setImportMessage({ type: 'success', text: 'Import réussi ! Vos données ont été importées.' });
      setImportFile(null);
    } catch (error) {
      setImportMessage({ type: 'error', text: 'Erreur lors de l\'import. Vérifiez le format du fichier.' });
    } finally {
      setIsImporting(false);
      setShowWarning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportMessage(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Export / Import des données
      </h2>

      {importMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            importMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {importMessage.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Section Export */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Exporter vos données</h3>
          <p className="text-gray-600 mb-4">
            Téléchargez l'ensemble de vos recettes et cookbooks au format JSON. Ce fichier peut être utilisé pour
            migrer vos données vers un autre compte ou pour sauvegarder vos données.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Export en cours...' : 'Exporter mes données'}
          </button>
        </div>

        {/* Section Import */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Importer des données</h3>
          <p className="text-gray-600 mb-4">
            Importez un fichier JSON contenant des recettes et cookbooks. Vous serez automatiquement
            attribué comme créateur de ces éléments.
          </p>

          {!showWarning ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <span className="sr-only">Choisir un fichier</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-orange-50 file:text-orange-700
                      hover:file:bg-orange-100 cursor-pointer"
                  />
                </label>
              </div>

              {importFile && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Fichier sélectionné: <span className="font-medium">{importFile.name}</span>
                  </span>
                  <button
                    onClick={() => setImportFile(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Annuler
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowWarning(true)}
                disabled={!importFile || isImporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4" />
                {isImporting ? 'Import en cours...' : 'Importer les données'}
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800 mb-2">Avertissement</h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    L'import va ajouter de nouvelles recettes et cookbooks à votre compte. Cette action
                    ne peut pas être annulée. Voulez-vous continuer ?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleImport}
                      disabled={isImporting}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                    >
                      {isImporting ? 'Import en cours...' : 'Confirmer l\'import'}
                    </button>
                    <button
                      onClick={() => setShowWarning(false)}
                      disabled={isImporting}
                      className="px-4 py-2 bg-white text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-50 disabled:opacity-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
