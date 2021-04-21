/*
Navicat MySQL Data Transfer

Source Server         : aliyun
Source Server Version : 80021
Source Host           : 8.135.2.4:3306
Source Database       : apitest

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2021-04-18 13:55:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for apiInfo
-- ----------------------------
DROP TABLE IF EXISTS `apiInfo`;
CREATE TABLE `apiInfo` (
  `apiId` int NOT NULL,
  `package` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `count` int DEFAULT NULL,
  `begin` varchar(255) DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`apiId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of apiInfo
-- ----------------------------
INSERT INTO `apiInfo` VALUES ('0', 'java.nio', 'ByteBuffer', 'get', 'c-o', '1942', 'rewind()', 'get()');
INSERT INTO `apiInfo` VALUES ('1', 'javax.swing', 'StringTokenizer', 'nextToken', 's-c', '41176', 'hasMoreTokens()', 'nextToken()');
INSERT INTO `apiInfo` VALUES ('2', 'java.lang.String', 'Scanner', 'nextLine', 's-c', '2796', 'hasNextLine()', 'nextLine()');
