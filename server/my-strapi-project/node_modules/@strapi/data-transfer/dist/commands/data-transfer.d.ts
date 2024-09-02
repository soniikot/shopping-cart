import Table from 'cli-table3';
import { Command, Option } from 'commander';
import ora from 'ora';
import type { LoadedStrapi, Strapi } from '@strapi/types';
import * as engineDatatransfer from '../engine';
declare const exitMessageText: (process: string, error?: boolean) => string;
declare const getDefaultExportName: () => string;
type ResultData = engineDatatransfer.ITransferResults<engineDatatransfer.ISourceProvider, engineDatatransfer.IDestinationProvider>['engine'];
declare const buildTransferTable: (resultData: ResultData) => Table.Table | undefined;
declare const DEFAULT_IGNORED_CONTENT_TYPES: string[];
declare const abortTransfer: ({ engine, strapi, }: {
    engine: engineDatatransfer.TransferEngine;
    strapi: LoadedStrapi;
}) => Promise<boolean>;
declare const setSignalHandler: (handler: (...args: unknown[]) => void, signals?: string[]) => Promise<void>;
declare const createStrapiInstance: (opts?: {
    logLevel?: string;
}) => Promise<Strapi & Required<Strapi>>;
declare const throttleOption: Option;
declare const excludeOption: Option;
declare const onlyOption: Option;
declare const validateExcludeOnly: (command: Command) => void;
declare const formatDiagnostic: (operation: string) => Parameters<engineDatatransfer.TransferEngine['diagnostics']['onDiagnostic']>[0];
type Loaders = {
    [key in engineDatatransfer.TransferStage]: ora.Ora;
};
type Data = {
    [key in engineDatatransfer.TransferStage]?: {
        startTime?: number;
        endTime?: number;
        bytes?: number;
        count?: number;
    };
};
declare const loadersFactory: (defaultLoaders?: Loaders) => {
    updateLoader: (stage: engineDatatransfer.TransferStage, data: Data) => ora.Ora;
    createLoader: (stage: engineDatatransfer.TransferStage) => ora.Ora;
    getLoader: (stage: engineDatatransfer.TransferStage) => ora.Ora;
};
/**
 * Get the telemetry data to be sent for a didDEITSProcess* event from an initialized transfer engine object
 */
declare const getTransferTelemetryPayload: (engine: engineDatatransfer.TransferEngine) => {
    eventProperties: {
        source: string;
        destination: string;
    };
};
/**
 * Get a transfer engine schema diff handler that confirms with the user before bypassing a schema check
 */
declare const getDiffHandler: (engine: engineDatatransfer.TransferEngine, { force, action, }: {
    force?: boolean | undefined;
    action: string;
}) => (context: engineDatatransfer.SchemaDiffHandlerContext, next: (ctx: engineDatatransfer.SchemaDiffHandlerContext) => void) => Promise<void>;
declare const getAssetsBackupHandler: (engine: engineDatatransfer.TransferEngine, { force, action, }: {
    force?: boolean | undefined;
    action: string;
}) => (context: engineDatatransfer.ErrorHandlerContext, next: (ctx: engineDatatransfer.ErrorHandlerContext) => void) => Promise<void>;
declare const shouldSkipStage: (opts: Partial<engineDatatransfer.ITransferEngineOptions>, dataKind: engineDatatransfer.TransferFilterPreset) => boolean;
declare const parseRestoreFromOptions: (opts: Partial<engineDatatransfer.ITransferEngineOptions>) => import("../strapi/providers/local-destination/strategies/restore").IRestoreOptions;
export { loadersFactory, buildTransferTable, getDefaultExportName, getTransferTelemetryPayload, DEFAULT_IGNORED_CONTENT_TYPES, createStrapiInstance, excludeOption, exitMessageText, onlyOption, throttleOption, validateExcludeOnly, formatDiagnostic, abortTransfer, setSignalHandler, getDiffHandler, getAssetsBackupHandler, shouldSkipStage, parseRestoreFromOptions, };
//# sourceMappingURL=data-transfer.d.ts.map