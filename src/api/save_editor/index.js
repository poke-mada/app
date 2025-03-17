import {
    getSaveName as _getSaveName,
    watchSave as _watchSave,
    stopWatching as _stopWatching
} from '@/api/save_editor/SaveAccesor'


export const getSaveName = _getSaveName;
export const watchSave = _watchSave;
export const stopWatching = _stopWatching;

export default {
    getSaveName,
    watchSave,
    stopWatching
};