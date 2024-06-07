"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberEnumToArray = void 0;
const numberEnumToArray = (numberEnum) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number');
};
exports.numberEnumToArray = numberEnumToArray;
