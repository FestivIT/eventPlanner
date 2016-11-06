-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Client :  localhost
-- Généré le :  Dim 06 Novembre 2016 à 13:40
-- Version du serveur :  5.5.52-MariaDB
-- Version de PHP :  5.6.23

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
-- Structure de la table `eqLogic`
--

CREATE TABLE `eqLogic` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `zoneId` int(11) NOT NULL,
  `matTypeId` int(11) NOT NULL,
  `eqRealId` int(11) NOT NULL,
  `ip` varchar(15) NOT NULL,
  `comment` text NOT NULL,
  `state` int(3) NOT NULL,
  `configuration` text NOT NULL
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
  `configuration` text NOT NULL
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
  `configuration` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `matType`
--

CREATE TABLE `matType` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `options` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `msg`
--

CREATE TABLE `msg` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
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
  `options` text,
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
  `configuration` text
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
-- Index pour la table `eqLogic`
--
ALTER TABLE `eqLogic`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `eqReal`
--
ALTER TABLE `eqReal`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `matType`
--
ALTER TABLE `matType`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `msg`
--
ALTER TABLE `msg`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `eqLogic`
--
ALTER TABLE `eqLogic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT pour la table `eqReal`
--
ALTER TABLE `eqReal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `matType`
--
ALTER TABLE `matType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT pour la table `msg`
--
ALTER TABLE `msg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
