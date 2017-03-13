-- phpMyAdmin SQL Dump
-- version 4.6.5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost
-- Généré le :  Jeu 23 Février 2017 à 09:37
-- Version du serveur :  5.5.53-MariaDB
-- Version de PHP :  5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `eventPlanner`
--

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

CREATE TABLE `config` (
  `plugin` varchar(127) NOT NULL DEFAULT 'core',
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `eqLink`
--

CREATE TABLE `eqLink` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `eqLogicId1` int(11) NOT NULL,
  `eqLogicId2` int(11) NOT NULL,
  `type` int(3) NOT NULL,
  `configuration` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `eqLogic`
--

CREATE TABLE `eqLogic` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `zoneId` int(11) NOT NULL,
  `matTypeId` int(11) NOT NULL,
  `eqRealId` int(11) DEFAULT NULL,
  `ip` varchar(15) NOT NULL,
  `comment` text NOT NULL,
  `state` int(3) NOT NULL,
  `localisation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `eqLogicAttribute`
--

CREATE TABLE `eqLogicAttribute` (
  `eqLogicId` int(11) NOT NULL,
  `matTypeAttribute` int(11) NOT NULL,
  `attributeValue` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `eqReal`
--

CREATE TABLE `eqReal` (
  `id` int(11) NOT NULL,
  `matTypeId` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `comment` text NOT NULL,
  `state` int(3) NOT NULL,
  `localisation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `localisation` varchar(50) NOT NULL,
  `ville` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `generalInfo` text NOT NULL,
  `configuration` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `matType`
--

CREATE TABLE `matType` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `parentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `matTypeAttribute`
--

CREATE TABLE `matTypeAttribute` (
  `id` int(11) NOT NULL,
  `matTypeId` int(11) NOT NULL,
  `attributeName` varchar(50) NOT NULL,
  `attributeOption` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `state` int(3) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `missionUserAssociation`
--

CREATE TABLE `missionUserAssociation` (
  `missionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `missionZoneAssociation`
--

CREATE TABLE `missionZoneAssociation` (
  `missionId` int(11) NOT NULL,
  `zoneId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `msg`
--

CREATE TABLE `msg` (
  `id` int(11) NOT NULL,
  `eventId` int(11) DEFAULT NULL,
  `zoneId` int(11) DEFAULT NULL,
  `eqId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` text NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `login` varchar(45) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `lastConnection` datetime NOT NULL,
  `eventId` int(11) DEFAULT NULL,
  `actionOnScan` varchar(20) NOT NULL,
  `slackID` varchar(50) NOT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `rights` text,
  `enable` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `zone`
--

CREATE TABLE `zone` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `eventId` int(11) DEFAULT NULL,
  `localisation` varchar(50) DEFAULT NULL,
  `installDate` date NOT NULL,
  `uninstallDate` date NOT NULL,
  `state` int(3) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`key`,`plugin`);

--
-- Index pour la table `eqLink`
--
ALTER TABLE `eqLink`
  ADD UNIQUE KEY `id_2` (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `eventId` (`eventId`),
  ADD KEY `fk_eqLinkEqLogicId1` (`eqLogicId1`),
  ADD KEY `fk_eqLinkEqLogicId2` (`eqLogicId2`);

--
-- Index pour la table `eqLogic`
--
ALTER TABLE `eqLogic`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eqLogicEqRealId` (`eqRealId`),
  ADD KEY `fk_eqLogicEventId` (`eventId`),
  ADD KEY `fk_eqLogicMatTypeId` (`matTypeId`),
  ADD KEY `fk_eqLogicZoneId` (`zoneId`);

--
-- Index pour la table `eqLogicAttribute`
--
ALTER TABLE `eqLogicAttribute`
  ADD PRIMARY KEY (`eqLogicId`),
  ADD UNIQUE KEY `eqLogicId` (`eqLogicId`,`matTypeAttribute`),
  ADD KEY `fk_eqLogicAttributeMatTypeAttributeId` (`matTypeAttribute`);

--
-- Index pour la table `eqReal`
--
ALTER TABLE `eqReal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eqRealMatTypeId` (`matTypeId`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `matType`
--
ALTER TABLE `matType`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_matTypeParentId` (`parentId`);

--
-- Index pour la table `matTypeAttribute`
--
ALTER TABLE `matTypeAttribute`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_matTypeAttributeId` (`matTypeId`);

--
-- Index pour la table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_missionEventId` (`eventId`);

--
-- Index pour la table `missionUserAssociation`
--
ALTER TABLE `missionUserAssociation`
  ADD UNIQUE KEY `missionId` (`missionId`,`userId`),
  ADD KEY `fk_missionAssociationUserId` (`userId`);

--
-- Index pour la table `missionZoneAssociation`
--
ALTER TABLE `missionZoneAssociation`
  ADD UNIQUE KEY `missionId` (`missionId`,`zoneId`),
  ADD KEY `fk_missionAssociationZoneId` (`zoneId`);

--
-- Index pour la table `msg`
--
ALTER TABLE `msg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_msgEventId` (`eventId`),
  ADD KEY `fk_msgUserId` (`userId`),
  ADD KEY `zoneId` (`zoneId`),
  ADD KEY `eqId` (`eqId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventId` (`eventId`);

--
-- Index pour la table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_zoneEventId` (`eventId`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `eqLink`
--
ALTER TABLE `eqLink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT pour la table `eqLogic`
--
ALTER TABLE `eqLogic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
--
-- AUTO_INCREMENT pour la table `eqLogicAttribute`
--
ALTER TABLE `eqLogicAttribute`
  MODIFY `eqLogicId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `eqReal`
--
ALTER TABLE `eqReal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT pour la table `matType`
--
ALTER TABLE `matType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT pour la table `matTypeAttribute`
--
ALTER TABLE `matTypeAttribute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `mission`
--
ALTER TABLE `mission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `msg`
--
ALTER TABLE `msg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=870;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT pour la table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `eqLink`
--
ALTER TABLE `eqLink`
  ADD CONSTRAINT `fk_eqLinkEqLogicId2` FOREIGN KEY (`eqLogicId2`) REFERENCES `eqLogic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLinkEqLogicId1` FOREIGN KEY (`eqLogicId1`) REFERENCES `eqLogic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLinkEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`);

--
-- Contraintes pour la table `eqLogic`
--
ALTER TABLE `eqLogic`
  ADD CONSTRAINT `fk_eqLogicEqRealId` FOREIGN KEY (`eqRealId`) REFERENCES `eqReal` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLogicEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLogicMatTypeId` FOREIGN KEY (`matTypeId`) REFERENCES `matType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLogicZoneId` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `eqLogicAttribute`
--
ALTER TABLE `eqLogicAttribute`
  ADD CONSTRAINT `fk_eqLogicAttributeMatTypeAttributeId` FOREIGN KEY (`matTypeAttribute`) REFERENCES `matTypeAttribute` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eqLogicAttributeEqLogicId` FOREIGN KEY (`eqLogicId`) REFERENCES `eqLogic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `eqReal`
--
ALTER TABLE `eqReal`
  ADD CONSTRAINT `fk_eqRealMatTypeId` FOREIGN KEY (`matTypeId`) REFERENCES `matType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `matType`
--
ALTER TABLE `matType`
  ADD CONSTRAINT `fk_matTypeParentId` FOREIGN KEY (`parentId`) REFERENCES `matType` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `matTypeAttribute`
--
ALTER TABLE `matTypeAttribute`
  ADD CONSTRAINT `fk_matTypeAttributeId` FOREIGN KEY (`matTypeId`) REFERENCES `matType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `mission`
--
ALTER TABLE `mission`
  ADD CONSTRAINT `fk_missionEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `missionUserAssociation`
--
ALTER TABLE `missionUserAssociation`
  ADD CONSTRAINT `fk_missionAssociationUserId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_missionAssociationMissionId` FOREIGN KEY (`missionId`) REFERENCES `mission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `missionZoneAssociation`
--
ALTER TABLE `missionZoneAssociation`
  ADD CONSTRAINT `fk_missionAssociationZoneId` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_missionAssociationZoneMissionId` FOREIGN KEY (`missionId`) REFERENCES `mission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `msg`
--
ALTER TABLE `msg`
  ADD CONSTRAINT `fk_msgEqId` FOREIGN KEY (`eqId`) REFERENCES `eqLogic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_msgEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_msgUserId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_msgZoneId` FOREIGN KEY (`zoneId`) REFERENCES `zone` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_userEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `zone`
--
ALTER TABLE `zone`
  ADD CONSTRAINT `fk_zoneEventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
