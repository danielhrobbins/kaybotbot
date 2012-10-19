-- phpMyAdmin SQL Dump
-- version 3.3.2deb1ubuntu1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 12, 2012 at 08:23 PM
-- Server version: 5.1.41
-- PHP Version: 5.3.2-1ubuntu4.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tt_dbase_one`
--

-- --------------------------------------------------------

--
-- Table structure for table `RAISING_ARIZONA`
--

CREATE TABLE IF NOT EXISTS `RAISING_ARIZONA` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote` varchar(395) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=64 ;

--
-- Dumping data for table `RAISING_ARIZONA`
--

INSERT INTO `RAISING_ARIZONA` (`id`, `quote`) VALUES
(1, 'Ear-Bending Cellmate: ...and when there was no meat, we ate fowl and when there was no fowl, we ate crawdad and when there was no crawdad to be found, we ate sand. H.I.: You ate what? Ear-Bending Cellmate: We ate sand. H.I.: You ate SAND? Ear-Bending Cellmate: That''s right!'),
(2, 'Dot: Now you take that diaper off your head and you put it back on your sister! '),
(3, 'Ed McDonnough: Gimme that baby, you wart-hog from hell! '),
(4, 'Ed McDonnough: This ain''t family life!  H.I.: Well... it sure ain''t "Ozzie and Harriet."'),
(5, 'Ed McDonnough: We finally go out with decent people and you break his nose. That ain''t too funny, Hi. H.I.: His kids seemed to think it was funny. Ed McDonnough: Well they''re just kids.'),
(6, 'Ed McDonnough: You mean you busted out of jail.  Evelle: No, ma''am. We released ourselves on our own recognizance.  Gale: What my brother here means to say is that we felt that the institution no longer had anything to offer us.'),
(7, 'Evelle: Awfully fine cereal flakes ya got, Mrs. McDonough.'),
(8, 'Evelle: Do these blow into funny shapes and all?  Grocer: Well, no, unless round is funny.'),
(9, 'Evelle: H.I., you''re young and you got your health, what you want with a job?'),
(10, 'Evelle: I got me some baby grub, baby wipes, diapers, then disposable kind. I also got a package of balloons.  Gale: They blow up into funny shapes and all?  Evelle: No, just circular.'),
(11, 'Evelle: Promise we ain''t never gonna leave him again, Gale. Promise me we ain''t never gonna give him up.  Gale: We ain''t never gonna give him up again, Evelle. He''s our little Gale Jr. now.'),
(12, 'Evelle: You know how to put these on?  Grocer: Well, around the butt and over the groin area.  Evelle: Do I need pins or something?  Grocer: They got them tape-ettes already on there. It''s self-contained and fairly explanatory.'),
(13, 'Gale: Alright ya'' hayseeds, it''s a stick-up. Everybody freeze. Everybody down on the ground.  Old Man in bank: Well, which is it young feller? You want I should freeze or get down on the ground? Mean to say, if''n I freeze, I can''t rightly drop. And if''n I drop, I''ma gonna be in motion. You see...  Gale: Shut up!  Old Man in bank: Okay then.  Gale: Everybody down on the ground!  Evelle: Y''all can just forget that part about freezin'' now.  Gale: Better still to get down there.  Evelle: Yeah, y''all hear that, don''t ya''?  Gale: Shit! Where''d all the tellers go?  Evelle: They''re on the floor as you commanded, Gale.'),
(14, 'Gale: Anyone found bipedal in five wears his ass for a hat!'),
(15, 'Gale: Got you on an awful short leash, don''t she, H.I.?'),
(16, 'Gale: Here you are sitting on your butt playing house with a... Don''t get me wrong, H.I., a fine woman but one who seems like she needs one of those button-down types.'),
(17, 'Gale: I know you''re partial to convenient stores, but dammit, H.I., the sun doesn''t rise and set on the corner grocery.'),
(18, 'Gale: Well, H.I., looks like you''ve been up to the devil''s business.'),
(19, 'Gale: Why ain''t you breast-feeding? You appear to be capable.  Ed McDonnough: Mind your own bid''ness.  Evelle: Ma''am, you don''t breast-feed him, he''ll hate you for it later. That''s why we wound up in prison.  Gale: Anyway, that''s what Doc Schwartz tells us.'),
(20, 'Gale: You understand, H.I.? If this works out, it''s just the beginning of a spree to cover the entire southwest proper. And we keep going until we can retire. Or we get caught.  Evelle: Either way, we''re fixed for life.'),
(21, 'Glen: How many Pollacks it take to screw up a lightbulb?  H.I.: I don''t know, Glen. One?  Glen: Nope, it takes three.  Glen: Wait a minute, I told it wrong. Here, I''m startin'' over: How come it takes three Pollacks to screw up a lightbulb?  H.I.: I don''t know, Glen.  Glen: ''Cause they''re so darn stupid!  '),
(22, 'Glen: Shit, man, loosen up! Don''t ya get it?  H.I.: No, Glen, I sure don''t.  Glen: Shit, man, think about it! I guess it''s what they call a "way homer."  H.I.: Why''s that?  Glen: ''Cause you only get it on the way home.  H.I.: I''m already home, Glen.'),
(23, 'Glen: Okay, so this Pollack walks into a bar, carrying a pile of dog shit in his hand, and he says "Look what I almost stepped in.'),
(24, 'Glen: Say that reminds me, how''d you get that kid so darn fast? Me and Dot went in to adopt on account a'' somethin'' went wrong with my semen, and they said we had to wait five years for a healthy white baby. I said, "Healthy white baby? Five years? What else you got?" Said they got two Koreans and a negra born with his heart on the outside. It''s a crazy world.  H.I.: Someone oughta sell tickets.  Glen: Sure, I''d buy one. '),
(25, 'Glen: Say, did you hear about the person of the Polish persuasion who walked into a bar with a big ''ol pile of shit in his hands and he says, "Look what I almost stepped in"? '),
(26, 'H.I.: A man for a husband.  Ed McDonnough: That ain''t no answer.  H.I.: Honey, that''s the only answer.  Ed McDonnough: That ain''t no answer.'),
(27, 'H.I.: And make it quick, I''m in dutch with the wife. '),
(28, 'H.I.: And this here''s the TV. Two hours a day, either educational or football, so you don''t ruin your appreciation of the finer things. '),
(29, 'H.I.: Biology and other peoples'' opinions conspired to keep us childless.'),
(30, 'H.I.: Do you ever get the feeling that there''s something... Powerful pressing down on you?  Glen: Yes, I know that feeling. I told Dot to lose some weight but she don''t wanna listen.'),
(31, 'H.I.: Edwina''s insides were a rocky place where my seed could find no purchase. '),
(32, 'H.I.: I tried to stand up and fly straight, but it wasn''t easy with that sumbitch Reagan in the White House. I dunno. They say he''s a decent man, so maybe his advisors are confused.'),
(33, 'H.I.: If it''s all the same to you, Honey, I think I''ll skip this little get together, slip out with the boys and knock back a couple of Coca Colas.  H.I.: I guess that wouldn''t be such a good idea.  Gale: So many social engagements, so little time.'),
(34, 'H.I.: Prison life is structured - more''n some people care for.'),
(35, 'H.I.: Sometimes it''s a hard world for small things. '),
(36, 'H.I.: There''s right and there''s right and never the t''wain shall meet. '),
(37, 'H.I.: We figured there was too much happiness here for just the two of us, so we figured the next logical step was to have us a critter.'),
(38, 'Hayseed in the Pickup:  Son, you got a panty on your head.'),
(39, 'Leonard Smalls: Name''s Smalls. Leonard Smalls. My friends call me Lenny... only I ain''t got no friends.'),
(40, 'Nathan Arizona Sr.: A dinner jacket - whaddaya think? He was wearin'' his damn jammies! They had Yodas ''n shit on ''em!  '),
(41, 'Nathan Arizona Sr.: Hell, they''re all disgruntled. I aint running no damn daisy farm. My motto is "Do it my way or watch your butt!" '),
(42, 'Nathan Arizona Sr.: If a frog had wings, it wouldn''t bump its ass a- hoppin''.'),
(43, 'Nathan Arizona Sr.: Look, it is exactly 8:45 in the PM. I''ll be down at that store in exactly 24 hours to kick me some butt. Or my name ain''t Nathan Arizona!'),
(44, 'Nathan Arizona Sr.: Of course he was wearing his jammies nobody sleeps naked in this house.  '),
(45, 'Nathan Arizona Sr.: Yeah, I changed my name. What of it?  Would you shop at a store called Unpainted Huffheins? '),
(46, 'Prison Counsellor: Why do you say you feel "trapped" in a man''s body.  "Trapped" Convict: Well, sometimes I get them menstrual cramps real hard.'),
(47, 'Evelle: Gale? Um, Junior just had a ... an accident.  Gale: What''s that, pardner?  Evelle: He had hisself a little ol'' accident.  Gale: What do you mean? He looks okay.  Evelle: No. You see, moving though we are, he just went and had hisself a little ol'' rest stop.  Gale: [sniffs the air] Well, that''s natural.'),
(48, 'Parole Board chairman: They''ve got a name for people like you H.I. That name is called "recidivism." '),
(49, 'Parole Board chairman: You''re not just telling us what we want to hear?  H.I.: No, sir, no way.  Parole Board member: ''Cause we just want to hear the truth.  H.I.: Well, then I guess I am telling you what you want to hear.  Parole Board chairman: Boy, didn''t we just tell you not to do that?  H.I.: Yes, sir.  Parole Board chairman: Okay, then.'),
(50, 'Nathan Arizona Sr.: Eight hundred leaf-tables and no chairs? You can''t sell leaf-tables and no chairs. Chairs, you got a dinette set. No chairs, you got d**k! '),
(51, 'H.I.: [to baby] And this here''s the TV. Two hours a day, either educational or football, so you don''t ruin your appreciation of the finer things.');
